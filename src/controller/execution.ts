import { NextApiRequest, NextApiResponse } from 'next'
import { RequestKey, ResponseKey } from '@/network-jar'
import { Controller } from '@/controller/controller'
import { ControllerJar } from '@/controller/jar'
import { MiddlewareExecutor } from '@/controller/middleware'
import { Logger } from '@/logger'
import { constructor } from '@/types'
import { NetworkJar } from '@/network-jar'
import { v4 as UUID } from 'uuid'

export type SupportedRequestMethods = 'get' | 'put' | 'delete' | 'post' | 'patch' | 'head' | 'options'

let startTime = Date.now()
let endTime = Date.now()
let difference = 0

function registerRequestAndResponseObjects(req: NextApiRequest, res: NextApiResponse) {
  NetworkJar.set(RequestKey, req)
  NetworkJar.set(ResponseKey, res)
}

function startCycleTimer() {
  startTime = Date.now()
  Logger.debug({ message: 'Request received', startTime })
}

function stopCycleTimer() {
  endTime = Date.now()
  difference = endTime - startTime
  Logger.debug({ message: 'Processing complete', startTime, endTime, difference: `${difference}ms` })
}

function getControllerInstance(controllerName: string) {
  const instance = ControllerJar.get<Controller>(controllerName)
  Logger.debug({ message: 'Controller instance resolved', controller: instance.constructor.name, fullControllerName: controllerName })
  return instance
}

export async function executeRequest(method: SupportedRequestMethods, instance: Controller, req: NextApiRequest, res: NextApiResponse) {
  let shouldStop: boolean

  shouldStop = await MiddlewareExecutor.before(method, instance, req, res)

  if (shouldStop) {
    return
  }

  const returnValue = await instance.handle(method, req, res)
  await MiddlewareExecutor.after(method, instance, req, res)
  stopCycleTimer()
  return returnValue
}

export function install(controller: constructor<Controller>) {
  const controllerName = `${controller.name}-${UUID()}`
  ControllerJar.set(controllerName, new controller())
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method) {
      startCycleTimer()
      registerRequestAndResponseObjects(req, res)
      const instance = getControllerInstance(controllerName)
      const method = req.method.toLowerCase() as SupportedRequestMethods
      return await executeRequest(method, instance, req, res)
    }

    // if the request has no method, which would be weird.
    // then we will return a 404 and end the response.
    return res.status(404).end()
  }
}

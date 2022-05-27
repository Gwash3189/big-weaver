import { NextApiRequest, NextApiResponse } from 'next'
import { RequestKey, ResponseKey } from '../network-jar'
import { Controller } from './controller'
import { ControllerJar } from './jar'
import { MiddlewareExecutor } from './middleware'
import { Logger } from '../logger'
import { constructor } from '../types'
import { NetworkJar } from '../network-jar'

export type SupportedRequestMethods =
  | 'GET'
  | 'get'
  | 'PUT'
  | 'put'
  | 'DELETE'
  | 'delete'
  | 'POST'
  | 'post'
  | 'PATCH'
  | 'patch'
  | 'HEAD'
  | 'head'
  | 'OPTIONS'
  | 'options'

let startTime = Date.now()
let endTime = Date.now()
let difference = 0

function registerRequestAndResponseObjects(req: NextApiRequest, res: NextApiResponse) {
  NetworkJar.set(RequestKey, req)
  NetworkJar.set(ResponseKey, res)
}

function startCycleTimer() {
  startTime = Date.now()
  Logger.debug({ message: 'Request Received', startTime })
}

function stopCycleTimer() {
  endTime = Date.now()
  difference = endTime - startTime
  Logger.debug({ message: 'Processing complete', startTime, endTime, difference: `${difference}ms` })
}

function getControllerInstance(controller: Function) {
  const instance = ControllerJar.get<Controller>(controller.name)
  Logger.debug({ message: 'Controller instance resolved', controller: instance.constructor.name })
  return instance
}

export async function executeRequest(method: string, instance: Controller, req: NextApiRequest, res: NextApiResponse) {
  MiddlewareExecutor.before(method, instance, req, res)
  const returnValue = await Reflect.apply(Reflect.get(instance, method), instance, [req, res])
  MiddlewareExecutor.after(method, instance, req, res)
  stopCycleTimer()
  return returnValue
}

export function install(controller: constructor<Controller>) {
  ControllerJar.set(controller.name, new controller())
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    startCycleTimer()
    registerRequestAndResponseObjects(req, res)
    const instance = getControllerInstance(controller)
    if (req.method) {
      const method = req.method.toLowerCase() as Lowercase<SupportedRequestMethods>
      return await instance.handle(method, req, res)
    }

    // if the request has no method, which would be weird.
    // then return a 404 and end the response.
    return res.status(404).end()
  }
}

import { NextApiRequest, NextApiResponse } from 'next'
import { container } from 'tsyringe'
import { RequestKey, ResponseKey } from '../container'
import { Controller } from './controller'
import { MiddlewareExecutor } from './middleware'
import { Logger } from '../logger'

let startTime = Date.now()
let endTime = Date.now()
let difference = 0

export async function executeRequest(method: string, instance: Controller, req: NextApiRequest, res: NextApiResponse) {
  MiddlewareExecutor.before(method, instance, req, res)
  const returnValue = await Reflect.apply(Reflect.get(instance, method), instance, [req, res])
  MiddlewareExecutor.after(method, instance, req, res)
  stopCycleTimer()
  return returnValue
}

function registerRequestAndResponseObjects(req: NextApiRequest, res: NextApiResponse) {
  container.register(RequestKey, { useValue: req })
  container.register(ResponseKey, { useValue: res })
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
  const instance = container.resolve<Controller>(controller as typeof Controller)
  Logger.debug({ message: 'Controller instance resolved', controller: instance.constructor.name })
  return instance
}

export function install(controller: Function) {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    startCycleTimer()
    registerRequestAndResponseObjects(req, res)
    const instance = getControllerInstance(controller)
    switch (req.method) {
      case 'GET': // eslint-disable-line no-fallthrough
        return await executeRequest(req.method.toLowerCase(), instance, req, res)
      case 'PUT': // eslint-disable-line no-fallthrough
        return await executeRequest(req.method.toLowerCase(), instance, req, res)
      case 'DELETE': // eslint-disable-line no-fallthrough
        return await executeRequest(req.method.toLowerCase(), instance, req, res)
      case 'POST': // eslint-disable-line no-fallthrough
        return await executeRequest(req.method.toLowerCase(), instance, req, res)
      case 'PATCH': // eslint-disable-line no-fallthrough
        return await executeRequest(req.method.toLowerCase(), instance, req, res)
      case 'HEAD': // eslint-disable-line no-fallthrough
        return await executeRequest(req.method.toLowerCase(), instance, req, res)
      case 'OPTIONS': // eslint-disable-line no-fallthrough
        return await executeRequest(req.method.toLowerCase(), instance, req, res)
      default:
        // eslint-disable-line no-fallthrough
        return res.status(404).end()
    }
  }
}

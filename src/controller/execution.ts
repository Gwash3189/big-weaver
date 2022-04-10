import { NextApiRequest, NextApiResponse } from 'next'
import { container } from 'tsyringe'
import { RequestKey, ResponseKey } from '../container'
import { Controller } from './controller'
import { MiddlewareExecutor } from './middleware'

async function executeRequest(method: string, instance: Controller, req: NextApiRequest, res: NextApiResponse) {
  MiddlewareExecutor.before(method, instance, req)
  const returnValue = await Reflect.apply(Reflect.get(instance, method), instance, [req, res])
  MiddlewareExecutor.after(method, instance, req, res)
  return returnValue
}

export function install(controller: Function) {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    container.register(RequestKey, { useValue: req })
    container.register(ResponseKey, { useValue: res })
    const instance = container.resolve<Controller>(controller as typeof Controller)
    switch (req.method) {
      case 'GET': // eslint-disable-line no-fallthrough
        return await executeRequest(req.method.toLowerCase(), instance, req, res)
      case 'PUT': // eslint-disable-line no-fallthrough
        return await executeRequest('put', instance, req, res)
      case 'DELETE': // eslint-disable-line no-fallthrough
        return await executeRequest('delete', instance, req, res)
      case 'POST': // eslint-disable-line no-fallthrough
        return await executeRequest('post', instance, req, res)
      case 'PATCH': // eslint-disable-line no-fallthrough
        return await executeRequest('patch', instance, req, res)
      case 'HEAD': // eslint-disable-line no-fallthrough
        return await executeRequest('head', instance, req, res)
      case 'OPTIONS': // eslint-disable-line no-fallthrough
        return await executeRequest('options', instance, req, res)
      default:
        // eslint-disable-line no-fallthrough
        return res.status(404).end()
    }
  }
}

import { NextApiRequest, NextApiResponse } from 'next'
import { container } from 'tsyringe'
import { Controller } from './controller'
import { MiddlewareExecutor } from './middleware'

function executeRequest(method: string, instance: Controller, req: NextApiRequest, res: NextApiResponse) {
  MiddlewareExecutor.before(method, instance, req)
  const returnValue = Reflect.apply(Reflect.get(instance, method), instance, [req, res])
  MiddlewareExecutor.after(method, instance, req, res)
  return returnValue
}

export function install(controller: Function) {
  return function handler(req: NextApiRequest, res: NextApiResponse) {
    const instance = container.resolve<Controller>(controller as typeof Controller)
    switch (req.method) {
      case 'GET': // eslint-disable-line no-fallthrough
        return executeRequest('get', instance, req, res)
      case 'PUT': // eslint-disable-line no-fallthrough
        return executeRequest('put', instance, req, res)
      case 'DELETE': // eslint-disable-line no-fallthrough
        return executeRequest('delete', instance, req, res)
      case 'POST': // eslint-disable-line no-fallthrough
        return executeRequest('post', instance, req, res)
      case 'PATCH': // eslint-disable-line no-fallthrough
        return executeRequest('patch', instance, req, res)
      case 'HEAD': // eslint-disable-line no-fallthrough
        return executeRequest('head', instance, req, res)
      case 'OPTIONS': // eslint-disable-line no-fallthrough
        return executeRequest('options', instance, req, res)
      default:
        // eslint-disable-line no-fallthrough
        return res.status(404).end()
    }
  }
}

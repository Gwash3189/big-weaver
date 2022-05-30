import { NextApiRequest, NextApiResponse } from 'next'
import { Facade } from '../facade'
import { Logger } from '../logger'
import { constructor } from '../types'
import { SupportedRequestMethods } from './execution'
import { AfterMiddleware, BeforeMiddleware, MiddlewareProvider } from './middleware'
import { Middleware } from './types'

export class Controller extends Facade {
  private readonly beforeMiddleware: Array<BeforeMiddleware> = []
  private readonly afterMiddleware: Array<AfterMiddleware> = []
  private readonly rescueMap: Record<string, Function>

  static configuration = {
    api: { bodyParser: true },
  }

  constructor() {
    super()

    this.rescueMap = {}
  }

  protected before(runner: Middleware) {
    const middleware = new BeforeMiddleware(runner)
    this.beforeMiddleware.push(middleware)
    return new MiddlewareProvider(middleware)
  }

  protected after(runner: Middleware) {
    const middleware = new AfterMiddleware(runner)
    this.afterMiddleware.push(middleware)
    return new MiddlewareProvider(middleware)
  }

  protected rescue<E>(exceptionClass: constructor<E>, func: (error: E, request: NextApiRequest, response: NextApiResponse) => any) {
    this.rescueMap[exceptionClass.name] = func
    return this
  }

  async handle(method: Lowercase<SupportedRequestMethods>, request: NextApiRequest, response: NextApiResponse) {
    try {
      if (this[method]) {
        // prettier-ignore
        return await this[method](request, response)
      }

      Logger.warn({ message: `${this.constructor.name} does not support ${method}` })
      Logger.warn({ message: `sending a 404 and ending the request` })

      return response.status(404).end()
    } catch (_error) {
      const error = _error as Error

      if (this.rescueMap[error.constructor.name]) {
        return await this.rescueMap[error.constructor.name](error, request, response)
      }

      Logger.error({ message: `unhandled error thrown by ${this.constructor.name} controller.` })
      Logger.error({ message: `to handle this error, use this.rescue(${error.constructor.name}, ...)` })
      Logger.error({ message: `sending 500 and ending the response` })

      return response.status(500).end()
    }
  }

  get(_req: NextApiRequest, res: NextApiResponse) {
    this.notFound(res)
  }

  post(_req: NextApiRequest, res: NextApiResponse) {
    this.notFound(res)
  }

  delete(_req: NextApiRequest, res: NextApiResponse) {
    this.notFound(res)
  }

  patch(_req: NextApiRequest, res: NextApiResponse) {
    this.notFound(res)
  }

  put(_req: NextApiRequest, res: NextApiResponse) {
    this.notFound(res)
  }

  head(_req: NextApiRequest, res: NextApiResponse) {
    this.notFound(res)
  }

  options(_req: NextApiRequest, res: NextApiResponse) {
    this.notFound(res)
  }

  private notFound(res: NextApiResponse) {
    return res.redirect('/404')
  }
}

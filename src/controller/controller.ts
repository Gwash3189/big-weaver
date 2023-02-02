import { NextApiRequest, NextApiResponse } from 'next'
import { Facade } from '../facade'
import { Logger } from '../logger'
import { constructor } from '../types'
import { SupportedRequestMethods } from '../controller/execution'
import { AfterMiddleware, BeforeMiddleware, MiddlewareProvider } from '../controller/middleware'
import { Middleware } from '../controller/types'

export class Controller extends Facade {
  private readonly beforeMiddleware: BeforeMiddleware[] = []
  private readonly afterMiddleware: AfterMiddleware[] = []
  private readonly rescueMap: Record<string, (error: any, request: NextApiRequest, response: NextApiResponse) => Promise<any>>

  static configuration = {
    api: { bodyParser: true }
  }

  constructor () {
    super()

    this.rescueMap = {}
  }

  protected before (runner: Middleware): MiddlewareProvider {
    const middleware = new BeforeMiddleware(runner)
    this.beforeMiddleware.push(middleware)
    return new MiddlewareProvider(middleware)
  }

  protected after (runner: Middleware): MiddlewareProvider {
    const middleware = new AfterMiddleware(runner)
    this.afterMiddleware.push(middleware)
    return new MiddlewareProvider(middleware)
  }

  protected rescue<E>(exceptionClass: constructor<E>, func: (error: E, request: NextApiRequest, response: NextApiResponse) => any): this {
    this.rescueMap[exceptionClass.name] = func
    return this
  }

  async handle (method: SupportedRequestMethods, request: NextApiRequest, response: NextApiResponse): Promise<any> {
    try {
      if (this[method] !== undefined) {
        return this[method](request, response)
      }

      Logger.warn({ message: `${this.constructor.name} does not support ${method}` })
      Logger.warn({ message: 'sending a 404 and ending the request' })

      return response.status(404).end()
    } catch (_error) {
      const error = _error as Error

      if (this.rescueMap[error.constructor.name] !== undefined) {
        return await this.rescueMap[error.constructor.name](error, request, response)
      }

      Logger.error({ message: `unhandled error thrown by ${this.constructor.name} controller.` })
      Logger.error({ message: `to handle this error, use this.rescue(${error.constructor.name}, (error, req, res) => ...)` })
      Logger.error({ message: 'sending 500 and ending the response' })
      Logger.error({ message: 'Error message', errorMessage: error.message })
      Logger.error({ message: 'Error name', errorName: error.name })

      return response.status(500).end()
    }
  }

  get(_request: NextApiRequest, response: NextApiResponse): void {
    this.notFound(response)
  }

  post(_request: NextApiRequest, response: NextApiResponse): void {
    this.notFound(response)
  }

  delete(_request: NextApiRequest, response: NextApiResponse): void {
    this.notFound(response)
  }

  patch(_request: NextApiRequest, response: NextApiResponse): void {
    this.notFound(response)
  }

  put(_request: NextApiRequest, response: NextApiResponse): void {
    this.notFound(response)
  }

  head<TResponse = any>(_request: NextApiRequest, response: NextApiResponse<TResponse>): void {
    this.notFound(response)
  }

  options<TResponse = any>(_request: NextApiRequest, response: NextApiResponse<TResponse>): void {
    this.notFound(response)
  }

  private notFound (res: NextApiResponse): NextApiResponse<any> {
    return res.redirect('/404')
  }
}

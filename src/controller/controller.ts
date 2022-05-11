import { NextApiRequest, NextApiResponse } from 'next'
import { constructor } from '../types'
import { AfterMiddleware, BeforeMiddleware, MiddlewareProvider } from './middleware'
import { IController, Middleware } from './types'

const controllerJar = new Map<string, constructor<Controller>>()

export class Jar {
  static set(name: string, instance: constructor<Controller>) {
    return controllerJar.set(name, instance)
  }

  static get(name: string) {
    return controllerJar.get(name)
  }
}

export class Controller implements IController {
  private readonly beforeMiddleware: Array<BeforeMiddleware> = []
  private readonly afterMiddleware: Array<AfterMiddleware> = []

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

  private notFound(res: NextApiResponse) {
    return res.redirect('/404')
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
}

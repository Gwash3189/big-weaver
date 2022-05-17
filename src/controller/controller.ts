import { NextApiRequest, NextApiResponse } from 'next'
import { AfterMiddleware, BeforeMiddleware, MiddlewareProvider } from './middleware'
import { Middleware } from './types'

export class Controller {
  private readonly beforeMiddleware: Array<BeforeMiddleware> = []
  private readonly afterMiddleware: Array<AfterMiddleware> = []

  static configuration = {
    api: { bodyParser: true }
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

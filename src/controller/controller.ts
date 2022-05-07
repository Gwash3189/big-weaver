import { NextApiRequest, NextApiResponse } from 'next'
import { container } from 'tsyringe'
import { constructor } from 'tsyringe/dist/typings/types'
import { AfterMiddleware, BeforeMiddleware, MiddlewareProvider } from './middleware'
import { After, Before, IController } from './types'

export class Controller implements IController {
  private readonly beforeMiddleware: Array<BeforeMiddleware> = []
  private readonly afterMiddleware: Array<AfterMiddleware> = []

  constructor() {
    container.register<IController>(this.constructor as constructor<IController>, {
      useValue: this,
    })
  }

  protected before(runner: Before) {
    const middleware = new BeforeMiddleware(runner)
    this.beforeMiddleware.push(middleware)
    return new MiddlewareProvider(middleware)
  }

  protected after(runner: After) {
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

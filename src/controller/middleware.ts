import { NextApiRequest, NextApiResponse } from 'next'
import { Facade } from '@/facade'
import { Controller } from '@/controller'
import { SupportedRequestMethods } from '@/controller/execution'
import { ActionReturn, Middleware as IMiddleware } from '@/controller/types'

export class Middleware {
  constructor (public handle: IMiddleware, private _except: string[] = [], private _only: string[] = []) {
    this.handle = handle
    this._except = _except
    this._only = _only
  }

  public except (...actions: string[]): void {
    this._except = [...this._except, ...actions]
  }

  public only (...actions: string[]): void {
    this._only = [...this._only, ...actions]
  }

  public shouldExecute (method: string): boolean {
    if (this._only.length === 0 && this._except.length === 0) {
      return true
    }

    if (this._only.length !== 0) {
      if (this._only.includes(method)) {
        return true
      } else {
        return false
      }
    }

    if (this._except.length !== 0) {
      if (this._except.includes(method)) {
        return false
      } else {
        return true
      }
    }

    return false
  }
}

export class BeforeMiddleware extends Middleware {
  constructor (public handle: IMiddleware) {
    super(handle)
  }
}

export class AfterMiddleware extends Middleware {
  constructor (public handle: IMiddleware) {
    super(handle)
  }
}

export class MiddlewareProvider {
  constructor (protected middleware: Middleware) {}

  except (action: SupportedRequestMethods): this {
    this.middleware.except(action)
    return this
  }

  only (action: SupportedRequestMethods): this {
    this.middleware.only(action)
    return this
  }
}

export class MiddlewareExecutor extends Facade {
  constructor (protected middleware: Middleware, private readonly method: string) {
    super()
  }

  static async before (method: string, controller: Controller, req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
    let shouldStop = false

    const stop = (): void => {
      shouldStop = true
    }

    const middleware = ((controller as unknown) as { beforeMiddleware: BeforeMiddleware[] }).beforeMiddleware
      .map(middleware => MiddlewareExecutor.create(middleware, method))
      .filter(middleware => middleware.shouldBeIncluded())

    for (let index = 0; index < middleware.length; index++) {
      const executor = middleware[index]
      await executor.execute(req, res, stop)
      if (shouldStop) {
        break
      }
    }

    return shouldStop
  }

  static async after (method: string, controller: Controller, req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
    let shouldStop = false

    const stop = (): void => {
      shouldStop = true
    }

    const middleware = ((controller as unknown) as { afterMiddleware: AfterMiddleware[] }).afterMiddleware
      .map(middleware => MiddlewareExecutor.create(middleware, method))
      .filter(middleware => middleware.shouldBeIncluded())

    for (let index = 0; index < middleware.length; index++) {
      const executor = middleware[index]
      await executor.execute(req, res, stop)
      if (shouldStop) {
        break
      }
    }

    return shouldStop
  }

  static create (middleware: Middleware, method: string): MiddlewareExecutor {
    return new MiddlewareExecutor(middleware, method)
  }

  shouldBeIncluded (): boolean {
    return this.middleware.shouldExecute(this.method)
  }

  async execute (req: NextApiRequest, res: NextApiResponse, stop: () => void): Promise<ActionReturn> {
    await this.middleware.handle(req, res, stop)
  }
}

import { NextApiRequest, NextApiResponse } from 'next'
import { Controller } from './controller'
import { After, Before } from './types'

export class Middleware {
  constructor(public handle: Before | After, private _except: Array<string> = [], private _only: Array<string> = []) {
    this.handle = handle
    this._except = _except
    this._only = _only
  }

  public except(...actions: string[]) {
    this._except = [...this._except, ...actions]
  }

  public only(...actions: string[]) {
    this._only = [...this._only, ...actions]
  }

  public shouldExecute(method: string) {
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
  constructor(public handle: Before) {
    super(handle)
  }
}

export class AfterMiddleware extends Middleware {
  constructor(public handle: After) {
    super(handle)
  }
}

export class MiddlewareProvider {
  constructor(protected middleware: Middleware) {}

  except(action: string) {
    this.middleware.except(action)
    return this
  }

  only(action: string) {
    this.middleware.only(action)
    return this
  }
}

export class MiddlewareExecutor {
  constructor(protected middleware: Middleware, private method: string) {}

  static before(method: string, controller: Controller, req: NextApiRequest) {
    let shouldStop = false

    const stop = () => {
      shouldStop = true
    }

    const middleware = ((controller as unknown) as { beforeMiddleware: BeforeMiddleware[] }).beforeMiddleware
      .map(middleware => MiddlewareExecutor.create(middleware, method))
      .filter(middleware => middleware.shouldBeIncluded())

      for (let index = 0; index < middleware.length; index++) {
        const executor = middleware[index];
        executor.execute(req, null, stop)
        if (shouldStop) {
          break
        }
      }
  }

  static after(method: string, controller: Controller, req: NextApiRequest, res: NextApiResponse) {
    let shouldStop = false

    const stop = () => {
      shouldStop = true
    }

    const middleware = ((controller as unknown) as { afterMiddleware: AfterMiddleware[] }).afterMiddleware
      .map(middleware => MiddlewareExecutor.create(middleware, method))
      .filter(middleware => middleware.shouldBeIncluded())

    for (let index = 0; index < middleware.length; index++) {
      const executor = middleware[index];
      executor.execute(req, res, stop)
      if (shouldStop) {
        break
      }
    }
  }

  static create(middleware: Middleware, method: string) {
    return new MiddlewareExecutor(middleware, method)
  }

  shouldBeIncluded() {
    return this.middleware.shouldExecute(this.method)
  }

  execute(req: NextApiRequest, res: NextApiResponse | null, stop: () => void) {
    if (this.middleware instanceof BeforeMiddleware) {
      this.middleware.handle(req, stop)
    }
    if (this.middleware instanceof AfterMiddleware && res !== null) {
      this.middleware.handle(req, res, stop)
    }
  }
}

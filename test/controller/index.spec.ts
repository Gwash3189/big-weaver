import { NextApiRequest, NextApiResponse } from 'next'
import { Controller } from '../../src/controller'
import { RequestBuilder, ResponseBuilder } from '../../src/test'
import { MiddlewareProvider } from '../../src/controller/middleware'

describe('Controller', () => {
  let req: NextApiRequest
  let res: NextApiResponse

  beforeEach(() => {
    req = {} as NextApiRequest
    res = ({
      redirect: jest.fn(),
      json: jest.fn(),
    } as unknown) as NextApiResponse
  })

  it('redirects to 404 by default', () => {
    ;['get', 'post', 'delete', 'patch', 'put', 'head', 'options'].forEach(method => {
      ;(new Controller() as any)[method](req, res)
      expect(res.redirect).toHaveBeenCalledWith('/404')
      ;(res.redirect as jest.Mock).mockClear()
    })
  })

  describe('#rescue', () => {
    let instance: Controller, mock: jest.Mock
    let error: CustomError
    let regularError: Error
    let request: NextApiRequest
    let response: NextApiResponse
    class CustomError extends Error{}
    class AnotherError extends Error{}
     class RescueController extends Controller {
      constructor() {
        super()

        mock = jest.fn((err) => {
          error = err
        })

        this.rescue(CustomError, mock)
        this.rescue(Error, (err) => {
          regularError = err
        })
      }

      get() {
        throw new CustomError()
      }

      post() {
        throw new Error()
      }

      put() {
        throw new AnotherError()
      }
    }

    beforeEach(() => {
      request = new RequestBuilder().build()
      response = new ResponseBuilder().build()
      instance = new RescueController()
      instance.handle('get', request, response)
    })

    it('catches the thrown error', () => {
      expect(error).toBeInstanceOf(CustomError)
    })

    it('calls the error handler with the correct arguments', () => {
      expect(mock).toHaveBeenCalledWith(expect.any(CustomError), request, response)
    })

    describe('when a different type of error is thrown', () => {
      beforeEach(() => {
        request = new RequestBuilder().build()
        response = new ResponseBuilder().build()
        instance = new RescueController()
        instance.handle('post', request, response)
      })

      it('calls the correct handler based upon the type of error thrown', () => {
        expect(regularError).toBeInstanceOf(Error)
        expect(mock).toHaveBeenCalledTimes(0)
      })
    })

    describe('when there is no handler for the thrown error', () => {
      beforeEach(() => {
        request = new RequestBuilder().build()
        response = new ResponseBuilder().build()
        instance = new RescueController()
        instance.handle('put', request, response)
      })

      it('calls the correct handler based upon the type of error thrown', () => {
        expect(response.statusCode).toEqual(500)
      })
    })
  })

  describe('#before', () => {
    const beforeFunction = jest.fn()
    let returnValue: MiddlewareProvider | null = null
    let instance: BeforeController

    class BeforeController extends Controller {
      constructor() {
        super()

        returnValue = this.before(beforeFunction)
          .only('get')
          .except('post')
      }
    }

    beforeEach(() => {
      instance = new BeforeController()
    })

    it('pushes the provided function into the before middleware stack', () => {
      expect((instance as any).beforeMiddleware[0].handle).toEqual(beforeFunction)
    })

    it('returns a MiddlewareProvider', () => {
      expect(returnValue).toBeInstanceOf(MiddlewareProvider)
    })

    describe('when the stop function is called', () => {
      let middlewareMock: jest.Mock
      class BeforeController extends Controller {
        constructor() {
          super()

          this.before((_req, _res, stop) => {
            stop()
          })

          this.before(middlewareMock)
        }
      }

      beforeEach(() => {
        middlewareMock = jest.fn()
        instance = new BeforeController()
        instance.get(req, res)
      })

      it("doesn't call middleware after stop is called", () => {
        expect(middlewareMock).not.toHaveBeenCalled()
      })
    })

    describe('#only', () => {
      it('tracks which method to apply the middleware to', () => {
        expect(((instance as any).beforeMiddleware[0] as any)._only).toEqual(['get'])
      })
    })

    describe('#except', () => {
      it('tracks which method to not apply the middleware to', () => {
        expect(((instance as any).beforeMiddleware[0] as any)._except).toEqual(['post'])
      })
    })
  })

  describe('#after', () => {
    const afterFunction = jest.fn()
    let returnValue: MiddlewareProvider | null = null
    let instance: AfterController

    class AfterController extends Controller {
      constructor() {
        super()

        returnValue = this.after(afterFunction)
          .only('get')
          .except('post')
      }
    }

    beforeEach(() => {
      instance = new AfterController()
    })

    it('pushes the provided function into the before middleware stack', () => {
      expect((instance as any).afterMiddleware[0].handle).toEqual(afterFunction)
    })

    it('returns a MiddlewareProvider', () => {
      expect(returnValue).toBeInstanceOf(MiddlewareProvider)
    })

    describe('when the stop function is called', () => {
      let middlewareMock: jest.Mock
      class AfterController extends Controller {
        constructor() {
          super()

          this.after((_req, _res, stop) => {
            stop()
          })

          this.after(middlewareMock)
        }
      }

      beforeEach(() => {
        middlewareMock = jest.fn()
        instance = new AfterController()
        instance.get(req, res)
      })

      it("doesn't call middleware after stop is called", () => {
        expect(middlewareMock).not.toHaveBeenCalled()
      })
    })

    describe('#only', () => {
      it('tracks which method to apply the middleware to', () => {
        expect(((instance as any).afterMiddleware[0] as any)._only).toEqual(['get'])
      })
    })

    describe('#except', () => {
      it('tracks which method to not apply the middleware to', () => {
        expect(((instance as any).afterMiddleware[0] as any)._except).toEqual(['post'])
      })
    })
  })
})

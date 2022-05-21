import { NextApiRequest, NextApiResponse } from 'next'
import { Controller } from '../../src/controller'
import { Middleware, MiddlewareExecutor } from '../../src/controller/middleware'

describe('Middleware', () => {
  let middleware: Middleware | null
  let handler

  beforeEach(() => {
    handler = jest.fn()
    middleware = new Middleware(handler)
  })

  describe('#except', () => {
    beforeEach(() => {
      middleware?.except('get')
    })

    it('stores the provided method for later', () => {
      expect((middleware as any)._except).toContain('get')
    })
  })

  describe('#only', () => {
    beforeEach(() => {
      middleware?.only('get')
    })

    it('stores the provided method for later', () => {
      expect((middleware as any)._only).toContain('get')
    })
  })

  describe('#shouldExecute', () => {
    beforeEach(() => {
      handler = jest.fn()
      middleware = new Middleware(handler)
    })

    describe('when only the get method should be called', () => {
      beforeEach(() => {
        middleware?.only('get')
      })

      describe('when there is a GET request', () => {
        it('returns true', () => {
          expect(middleware?.shouldExecute('get')).toEqual(true)
        })
      })

      describe('when there is a POST request', () => {
        it('returns false', () => {
          expect(middleware?.shouldExecute('post')).toEqual(false)
        })
      })
    })

    describe('when multiple methods are registered with #only', () => {
      beforeEach(() => {
        middleware?.only('get', 'post', 'HEAD')
      })

      describe('when there is a HEAD request', () => {
        it('returns true', () => {
          expect(middleware?.shouldExecute('HEAD')).toEqual(true)
        })
      })

      describe('when there is a PUT request', () => {
        it('returns false', () => {
          expect(middleware?.shouldExecute('put')).toEqual(false)
        })
      })
    })

    describe('when everything except the get method should be called', () => {
      beforeEach(() => {
        middleware?.except('get')
      })

      describe('when there is a GET request', () => {
        it('returns false', () => {
          expect(middleware?.shouldExecute('get')).toEqual(false)
        })
      })

      describe('when there is a POST request', () => {
        it('returns true', () => {
          expect(middleware?.shouldExecute('post')).toEqual(true)
        })
      })
    })

    describe('when multiple methods are registed with the #except method', () => {
      beforeEach(() => {
        middleware?.except('get', 'post', 'HEAD')
      })

      describe('when there is a GET request', () => {
        it('returns false', () => {
          expect(middleware?.shouldExecute('get')).toEqual(false)
        })
      })

      describe('when there is a PUT request', () => {
        it('returns true', () => {
          expect(middleware?.shouldExecute('PUT')).toEqual(true)
        })
      })
    })

    describe('when no methods have been added to only or except', () => {
      describe('when there is a GET request', () => {
        it('returns true', () => {
          expect(middleware?.shouldExecute('get')).toEqual(true)
        })
      })
    })
  })
})

describe('MiddlewareExecutor', () => {
  describe('#before', () => {
    class TestController extends Controller {
      constructor() {
        super()

        this.before(middleware)
      }
    }

    let middleware: jest.Mock, req: NextApiRequest, res: NextApiResponse, mockController: TestController

    beforeEach(() => {
      middleware = jest.fn()
      req = (jest.fn() as unknown) as NextApiRequest
      res = (jest.fn() as unknown) as NextApiResponse
      mockController = new TestController()
    })

    describe('when no methods have been excluded or included', () => {
      beforeEach(() => {
        MiddlewareExecutor.before('get', mockController, req, res)
      })

      it('executes the middleware', () => {
        expect(middleware).toHaveBeenCalledWith(req, res, expect.any(Function))
      })
    })

    describe('when only the get method should be run', () => {
      class OnlyController extends Controller {
        constructor() {
          super()

          this.before(middleware).only('get')
        }
      }

      beforeEach(() => {
        middleware = jest.fn()
        req = (jest.fn() as unknown) as NextApiRequest
        mockController = new OnlyController()
      })

      describe('when there is a get request', () => {
        beforeEach(() => {
          MiddlewareExecutor.before('get', mockController, req, res)
        })

        it('executes the middles', () => {
          expect(middleware).toHaveBeenCalledWith(req, res, expect.any(Function))
        })
      })

      describe('when there is not a get request', () => {
        beforeEach(() => {
          middleware = jest.fn()
          req = (jest.fn() as unknown) as NextApiRequest
          res = (jest.fn() as unknown) as NextApiResponse
          mockController = new OnlyController()
          MiddlewareExecutor.before('post', mockController, req, res)
        })

        it('does not execute the middles', () => {
          expect(middleware).not.toHaveBeenCalledWith(req, expect.any(Function))
        })
      })

      describe('when the stop function is called', () => {
        let res: NextApiResponse
        class TestController extends Controller {
          constructor() {
            super()

            this.before((_req, _res, stop) => {
              stop()
            })

            this.before(middleware)
          }
        }

        beforeEach(() => {
          middleware = jest.fn()
          req = (jest.fn() as unknown) as NextApiRequest
          res = ({
            redirect: jest.fn(),
          } as unknown) as NextApiResponse
          mockController = new TestController()
          mockController.get(req, res)
        })

        it("doesn't call middleware after stop is called", () => {
          expect(middleware).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe('#after', () => {
    class TestController extends Controller {
      constructor() {
        super()

        this.after(middleware)
      }
    }

    let middleware: jest.Mock, req: NextApiRequest, res: NextApiResponse, mockController: TestController

    beforeEach(() => {
      middleware = jest.fn()
      req = (jest.fn() as unknown) as NextApiRequest
      res = (jest.fn() as unknown) as NextApiResponse
      mockController = new TestController()
    })

    describe('when the stop function is called', () => {
      class TestController extends Controller {
        constructor() {
          super()

          this.after((_req, _res, stop) => {
            stop()
          })

          this.after(middleware)
        }
      }

      beforeEach(() => {
        middleware = jest.fn()
        req = (jest.fn() as unknown) as NextApiRequest
        res = ({
          redirect: jest.fn(),
        } as unknown) as NextApiResponse
        mockController = new TestController()
        mockController.get(req, res)
      })

      it("doesn't call middleware after stop is called", () => {
        expect(middleware).not.toHaveBeenCalled()
      })
    })

    describe('when no methods have been excluded or included', () => {
      beforeEach(() => {
        MiddlewareExecutor.after('get', mockController, req, res)
      })

      it('executes the middleware', () => {
        expect(middleware).toHaveBeenCalledWith(req, res, expect.any(Function))
      })
    })

    describe('when only the get method should be run', () => {
      class OnlyController extends Controller {
        constructor() {
          super()

          this.after(middleware).only('get')
        }
      }

      beforeEach(() => {
        middleware = jest.fn()
        req = (jest.fn() as unknown) as NextApiRequest
        res = (jest.fn() as unknown) as NextApiResponse
        mockController = new OnlyController()
      })

      describe('when there is a get request', () => {
        beforeEach(() => {
          MiddlewareExecutor.after('get', mockController, req, res)
        })

        it('executes the middles', () => {
          expect(middleware).toHaveBeenCalledWith(req, res, expect.any(Function))
        })
      })

      describe('when there is not a get request', () => {
        beforeEach(() => {
          middleware = jest.fn()
          req = (jest.fn() as unknown) as NextApiRequest
          res = (jest.fn() as unknown) as NextApiResponse
          mockController = new OnlyController()
          MiddlewareExecutor.after('post', mockController, req, res)
        })

        it('does not execute the middles', () => {
          expect(middleware).not.toHaveBeenCalledWith(req, res, expect.any(Function))
        })
      })
    })
  })
})

import { NextApiRequest, NextApiResponse } from 'next'
import { Controller } from '../../src'
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

          this.before((_req, stop) => {
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

      it('doesn\'t call middleware after stop is called', () => {
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
})

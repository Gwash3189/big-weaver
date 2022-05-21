import { NextApiRequest, NextApiResponse } from 'next'
import { Controller, install } from '../../src/controller'

let controllerSpy: jest.Mock

class TestController extends Controller {
  get(req: NextApiRequest, res: NextApiResponse) {
    controllerSpy(req, res)
  }

  put(req: NextApiRequest, res: NextApiResponse) {
    controllerSpy(req, res)
  }

  post(req: NextApiRequest, res: NextApiResponse) {
    controllerSpy(req, res)
  }

  delete(req: NextApiRequest, res: NextApiResponse) {
    controllerSpy(req, res)
  }

  patch(req: NextApiRequest, res: NextApiResponse) {
    controllerSpy(req, res)
  }

  head(req: NextApiRequest, res: NextApiResponse) {
    controllerSpy(req, res)
  }

  options(req: NextApiRequest, res: NextApiResponse) {
    controllerSpy(req, res)
  }
}

describe('#install', () => {
  let handler

  it('returns a function', () => {
    expect(install(TestController)).toBeInstanceOf(Function)
  })

  describe('#handler', () => {
    let req: NextApiRequest, res: NextApiResponse

    describe("when the request method isn't known", () => {
      beforeEach(() => {
        handler = install(TestController)
        controllerSpy = jest.fn()
        req = {
          method: 'DERP',
        } as NextApiRequest
        res = ({
          status: jest.fn(() => res),
          end: jest.fn(() => res),
        } as unknown) as NextApiResponse

        handler(req, res)
      })

      it('sets the status to 404', () => {
        expect(res.status).toHaveBeenCalledWith(404)
      })

      it('ends the response', () => {
        expect(res.end).toHaveBeenCalled()
      })
    })

    describe('when the provided controller has a get method', () => {
      ;['GET', 'PUT', 'DELETE', 'POST', 'PATCH', 'HEAD', 'OPTIONS'].forEach(method => {
        describe(`when there is a ${method} request`, () => {
          beforeEach(() => {
            handler = install(TestController)
            controllerSpy = jest.fn()
            req = {
              method,
            } as NextApiRequest
            res = ({
              status: jest.fn(() => res),
              end: jest.fn(() => res),
            } as unknown) as NextApiResponse

            handler(req, res)
          })

          it(`runs the ${method} method on the controller`, () => {
            expect(controllerSpy).toHaveBeenCalledWith(req, res)
          })
        })
      })
    })
  })
})

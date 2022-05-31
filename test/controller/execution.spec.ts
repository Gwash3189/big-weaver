import { NextApiRequest, NextApiResponse } from 'next'
import { Controller, install } from '../../src/controller'
import { Logger } from '../../src/logger'

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

    describe('when the provided controller has a supported method', () => {
      ;['GET', 'PUT', 'DELETE', 'POST', 'PATCH', 'HEAD', 'OPTIONS'].forEach(method => {
        describe('logs when the request starts and finishes processing', () => {})

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
            Logger.mock('debug', jest.fn())

            handler(req, res)
          })

          afterEach(() => {
            Logger.reset('debug')
          })

          it(`runs the ${method} method on the controller`, () => {
            expect(controllerSpy).toHaveBeenCalledWith(req, res)
          })

          it('calls the logger when processing starts', () => {
            expect(Logger.debug).toHaveBeenCalledWith({
              message: 'Request received',
              startTime: expect.any(Number),
            })
          })

          it('calls the logger when processing ends', () => {
            expect(Logger.debug).toHaveBeenCalledWith({
              message: 'Processing complete',
              startTime: expect.any(Number),
              endTime: expect.any(Number),
              difference: expect.any(String),
            })
          })

          it('calls the logger when when the controller instance is found', () => {
            expect(Logger.debug).toHaveBeenCalledWith({
              message: 'Controller instance resolved',
              controller: expect.any(String),
            })
          })
        })
      })
    })
  })
})

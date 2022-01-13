import { NextApiRequest, NextApiResponse } from 'next'
import { Action, HandlerConfig, register } from '../../src/actions'

describe('when a action is registered', () => {
  let handler: Function
  let req: NextApiRequest
  let res: NextApiResponse
  let config: HandlerConfig
  let actionSpy: jest.Mock
  const makeRequest = (method: string): NextApiRequest => (({ method: method.toUpperCase() } as unknown) as NextApiRequest)
  const makeResponse = (): NextApiResponse => (({} as unknown) as NextApiResponse)
  const makeConfig = (method: string): HandlerConfig => ({ [method]: ((() => actionSpy) as unknown) as Action })
  const makeTestData = (method: string) => ({ req: makeRequest(method), res: makeResponse(), config: makeConfig(method) })

  beforeEach(() => {
    actionSpy = jest.fn()
  })

  it('returns a request handler', () => {
    config = makeConfig('get')
    handler = register(config)
    expect(handler).toBeInstanceOf(Function)
  })

  describe('when request comes in', () => {
    describe('and the method is GET', () => {
      beforeEach(() => {
        ;({ req, res, config } = makeTestData('get'))
        handler = register(config)
      })

      it('it runs the handler', () => {
        handler(req, res)
        expect(actionSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('and the method is PUT', () => {
      beforeEach(() => {
        ;({ req, res, config } = makeTestData('put'))
        handler = register(config)
      })

      it('it runs the handler', () => {
        handler(req, res)
        expect(actionSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('and the method is DELETE', () => {
      beforeEach(() => {
        ;({ req, res, config } = makeTestData('delete'))
        handler = register(config)
      })

      it('it runs the handler', () => {
        handler(req, res)
        expect(actionSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('and the method is POST', () => {
      beforeEach(() => {
        ;({ req, res, config } = makeTestData('post'))
        handler = register(config)
      })

      it('it runs the handler', () => {
        handler(req, res)
        expect(actionSpy).toHaveBeenCalledTimes(1)
      })
    })
  })
})

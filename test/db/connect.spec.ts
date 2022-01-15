import { connect } from '../../src/db/connect'

describe('connect', () => {
  const spy = jest.fn()
  class Client {
    constructor() {
      spy()
    }
  }

  describe('when connect is called', () => {
    it('creates a new client', () => {
      connect<string>(() => Promise.resolve(''), Client)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('when called again, it does not make a new client', () => {
      connect<string>(() => Promise.resolve(''), Client)
      expect(spy).not.toHaveBeenCalledTimes(2)
    })
  })
})

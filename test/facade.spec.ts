import { Facade } from '../src/facade'

describe('Facade', () => {
  class Test extends Facade {
    static hello() {
      return 'hello world'
    }
  }

  describe('#mock', () => {
    describe('when the method is not mocked', () => {
      it('returns the expected value', () => {
        expect(Test.hello()).toEqual('hello world')
      })
    })

    describe('when the method is mocked', () => {
      beforeEach(() => {
        Test.mock(
          'hello',
          jest.fn(() => 'mocked hello')
        )
      })

      it('returns the mocked value', () => {
        expect(Test.hello()).toEqual('mocked hello')
        expect(Test.hello).toHaveBeenCalled()
      })
    })
  })

  describe('#reset', () => {
    let mock: jest.Mock

    beforeEach(() => {
      mock = jest.fn()
    })

    it('resets the function back to its original implementation', () => {
      expect(Test.mock.constructor).not.toEqual(mock)

      Test.mock('hello', mock)
      expect(Test.hello).toEqual(mock)

      Test.reset('hello')
      expect(Test.hello).not.toEqual(mock)
    })
  })
})

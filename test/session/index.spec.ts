import { NextApiRequest } from 'next'
import { NetworkJar, RequestKey, ResponseKey } from '../../src/network-jar'
import { Session } from '../../src/session'
let setMock: jest.Mock
let getMock: jest.Mock

jest.mock('cookies', () => {
  return jest.fn(() => {
    return {
      set: setMock,
      get: getMock,
    }
  })
})

describe('Session', () => {
  describe('#set', () => {
    beforeEach(() => {
      setMock = jest.fn()
      NetworkJar.set(RequestKey, ({} as unknown) as NextApiRequest)
      NetworkJar.set(ResponseKey, ({} as unknown) as NextApiRequest)
      Session.set('name', { json: true })
    })

    it('sets the required cookie', () => {
      expect(setMock).toHaveBeenCalledWith('name', JSON.stringify({ json: true }), {
        path: '/',
      })
    })

    describe('when additional options are provided', () => {
      beforeEach(() => {
        setMock = jest.fn()
        NetworkJar.set(RequestKey, ({} as unknown) as NextApiRequest)
        NetworkJar.set(ResponseKey, ({} as unknown) as NextApiRequest)
        Session.set(
          'name',
          { json: true },
          {
            path: '/another/path',
          }
        )
      })

      it('sets the required cookie', () => {
        expect(setMock).toHaveBeenCalledWith('name', JSON.stringify({ json: true }), {
          path: '/another/path',
        })
      })
    })
  })

  describe('#get', () => {
    beforeEach(() => {
      getMock = jest.fn()
      NetworkJar.set(RequestKey, ({} as unknown) as NextApiRequest)
      NetworkJar.set(ResponseKey, ({} as unknown) as NextApiRequest)
      Session.get('name', undefined)
    })

    it('gets the required cookie', () => {
      expect(getMock).toHaveBeenCalledWith('name')
    })

    describe("when there isn't anything to get", () => {
      let result: { defaultValue: boolean }

      beforeEach(() => {
        getMock = jest.fn(() => undefined)
        NetworkJar.set(RequestKey, ({} as unknown) as NextApiRequest)
        NetworkJar.set(ResponseKey, ({} as unknown) as NextApiRequest)
        result = Session.get('name', { defaultValue: true })
      })

      it('returns that default value', () => {
        expect(result).toEqual({
          defaultValue: true,
        })
      })
    })
  })

  describe('#clear', () => {
    beforeEach(() => {
      setMock = jest.fn()
      NetworkJar.set(RequestKey, ({} as unknown) as NextApiRequest)
      NetworkJar.set(ResponseKey, ({} as unknown) as NextApiRequest)
      Session.clear('name')
    })

    it('clears the cookie', () => {
      expect(setMock).toHaveBeenCalledWith('name', '', {
        path: '/',
        expires: expect.any(Date),
      })
    })
  })
})

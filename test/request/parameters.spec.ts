import { NextApiRequest } from 'next'
import { NetworkJar, RequestKey } from '../../src/network-jar'
import { Parameters } from '../../src/request/parameters'

describe(Parameters, () => {
  describe('#get', () => {
    beforeEach(() => {
      NetworkJar.set(RequestKey, ({
        query: { argument: true },
        body: { argument: true },
      } as unknown) as NextApiRequest)
    })

    it('returns an instance of Parameters', () => {
      const params = Parameters.get()

      expect(params.body()).toEqual({ argument: true })
      expect(params.query()).toEqual({ argument: true })
    })
  })

  describe('#query', () => {
    beforeEach(() => {
      NetworkJar.set(RequestKey, ({
        query: { page: 1 },
        body: { name: 'Adam' },
      } as unknown) as NextApiRequest)
    })

    it('returns the requests query parameters', () => {
      expect(Parameters.get().query()).toEqual({
        page: 1
      })
    })
  })

})

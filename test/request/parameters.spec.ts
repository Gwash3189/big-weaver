import { NextApiRequest } from 'next'
import { z } from 'zod'
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

  describe('#validate', () => {
    beforeEach(() => {
      NetworkJar.set(RequestKey, ({
        query: { page: 1 },
        body: { name: 'Adam' },
      } as unknown) as NextApiRequest)
    })

    it('validates the parameters against the provided schema', () => {
      expect(
        Parameters.get().validate(z.object({
          query: z.object({ page: z.number() }),
          body: z.object({ name: z.string() }),
        }))
      ).toEqual({
        data: {
          body: {
            name: 'Adam',
          },
          query: {
            page: 1,
          },
        },
        success: true,
      })
    })

    describe("when the parameters don't pass validation", () => {
      beforeEach(() => {
        NetworkJar.set(RequestKey, ({
          query: { page: 1 },
          body: {},
        } as unknown) as NextApiRequest)
      })

      it('returns success equaling false', () => {
        expect(
          Parameters.get().validate(
            z.object({
              query: z.object({ page: z.number() }),
              body: z.object({ name: z.string() }),
            })
          )
        ).toEqual(
          expect.objectContaining({
            success: false,
          })
        )
      })
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

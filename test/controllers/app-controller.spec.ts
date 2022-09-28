import { NextApiRequest, NextApiResponse } from 'next'
import { AppController } from '../../src/controllers/app-controller'
import { get, RequestBuilder, ResponseType } from '../../src/test'

class RandoController extends AppController {
  get(_req: NextApiRequest, res: NextApiResponse<any>): void {
    res.json(this.params)
  }
}

describe('AppController', () => {
  describe('when a controller uses this.param', () => {
    let response: ResponseType

    beforeEach(async () => {
      const request = new RequestBuilder()
        .body({
          body: true,
        })
        .query({
          query: 'true',
        })

      response = await get(RandoController, request)
    })

    it("says it's alive", () => {
      expect(response.json).toEqual({
        body: {
          body: true,
        },
        query: {
          query: 'true',
        },
      })
    })
  })
})

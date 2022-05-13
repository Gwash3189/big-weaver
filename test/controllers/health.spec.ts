import { HealthController } from '../../src/controllers/health'
import { get, RequestBuilder, ResponseType } from '../../src/test'

describe('HealthController', () => {
  describe('when there is a get request', () => {
    let response: ResponseType

    beforeEach(async () => {
      response = await get(HealthController, new RequestBuilder())
    })

    it("says it's alive", () => {
      expect(response.json).toEqual({ alive: true })
    })
  })
})

import { HealthController } from '../../src/controllers/health'
import { get, ResponseType } from '../../src/test'

describe('HealthController', () => {
  describe('when there is a get request', () => {
    let response: ResponseType

    beforeEach(async () => {
      response = await get(HealthController)
    })

    it("says it's alive", () => {
      expect(response.json).toEqual({ alive: true })
    })
  })
})

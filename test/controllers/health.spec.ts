import { ConfigurationController } from '../../src/controllers/configuration'
import { HealthController } from '../../src/controllers/health'
import { get, ResponseType } from '../../src/test'

describe('HealthController', () => {
  describe('when there is a get request', () => {
    let response: ResponseType

    beforeEach(async () => {
      ConfigurationController.mock(
        'configured',
        jest.fn(() => true)
      )
      response = await get(HealthController)
    })

    afterEach(() => {
      ConfigurationController.reset('configured')
    })

    it("says it's alive", () => {
      expect(response.json).toEqual({ alive: true })
    })
  })
})

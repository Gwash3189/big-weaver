import { ConfigurationController } from '../../src/controllers/configuration'
import { get, RequestBuilder } from '../../src/test/controller'

describe('ConfigurationController', () => {
  describe('get', () => {
    it('is unconfigured before a request comes through', async () => {
      expect(ConfigurationController.configured()).toEqual(false)
    })

    it('is configured after a request comes through', async () => {
      await get(ConfigurationController, new RequestBuilder())
      expect(ConfigurationController.configured()).toEqual(true)
    })
  })
})

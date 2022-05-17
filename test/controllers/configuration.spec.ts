import { ConfigurationController } from '../../src/controllers/configuration'
import { Auth } from '../../src/auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { Env } from '../../src/env'
import { executeRequest } from '../../src/controller/execution'
import { Logger } from '../../src/logger'

describe('ConfigurationController', () => {
  let jsonMock: jest.Mock, instance: ConfigurationController, res: NextApiResponse, req: NextApiRequest

  beforeEach(async () => {
    instance = new ConfigurationController()
    instance.reset()
    jsonMock = jest.fn()
    Auth.mock('configure', jest.fn())
    Logger.mock('debug', jest.fn())
    res = ({ json: jsonMock } as unknown) as NextApiResponse
    req = (jest.fn() as unknown) as NextApiRequest
    await executeRequest('get', instance, req, res)
  })

  afterEach(() => {
    Auth.reset('configure')
  })

  it('completes configuration after the before middleware', async () => {
    expect(ConfigurationController.configured()).toEqual(true)
  })

  describe('when the JWT_SECRET exists', () => {
    beforeEach(() => {
      Env.mock(
        'get',
        jest.fn(() => 'JWT_SECRET')
      )
      Env.mock(
        'exists',
        jest.fn(() => true)
      )
      Logger.mock('debug', jest.fn())
      instance.reset()
      executeRequest('get', instance, req, res)
    })

    afterEach(() => {
      Env.reset('get', 'exists')
    })

    it('configures Auth', () => {
      expect(Auth.configure).toHaveBeenCalledWith('JWT_SECRET')
    })

    it('prints a helpful debug message', () => {
      expect(Logger.debug).toHaveBeenCalledWith({ message: 'configuring Auth with provided process.env.JWT_SECRET' })
    })
  })

  describe('when the JWT_SECRET does not exists', () => {
    beforeEach(() => {
      Env.mock(
        'exists',
        jest.fn(() => false)
      )
      instance.reset()
      executeRequest('get', instance, req, res)
    })

    it('configures Auth', () => {
      expect(Auth.configure).toHaveBeenCalledWith('secret')
    })

    it('prints a helpful debug message', () => {
      expect(Logger.debug).toHaveBeenCalledWith({ message: 'no process.env.JWT_SECRET set, defaulting to development secret' })
    })
  })
})

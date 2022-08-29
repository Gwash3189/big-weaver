import { CurrentJWT, Protected } from '../../../src/auth/middleware'
import { Auth } from '../../../src/auth'
import { Controller } from '../../../src/controller'
import { NextApiRequest, NextApiResponse } from 'next'
import { get, RequestBuilder, ResponseType } from '../../../src/test'
import { Logger } from '../../../src/logger'

describe('Protected', () => {
  let getSpy: jest.Mock
  let request: RequestBuilder

  class UserController extends Controller {
    constructor() {
      super()

      this.before(Protected.middleware)
    }

    get(_req: NextApiRequest, _res: NextApiResponse<any>): void {
      getSpy()
    }
  }

  describe('when then provided JWT is valid', () => {
    beforeEach(async () => {
      getSpy = jest.fn()
      const jwt = await Auth.createJwt({
        user: {
          id: '123'
        },
        account: {
          id: '123'
        }
      })
      request = new RequestBuilder().headers(Auth.header, jwt)
      await get(UserController, request)
    })

    it('calls the correct controller action', () => {
      expect(getSpy).toHaveBeenCalled()
    })

    it('puts the value into the CurrentJWT Jar', () => {
      expect(CurrentJWT.get()).toEqual(expect.objectContaining({ user: { id: '123' }}))
    })
  })

  describe('when then provided JWT is invalid', () => {
    let response: ResponseType

    beforeEach(async () => {
      Logger.mock('debug', jest.fn())
      getSpy = jest.fn()
      request = new RequestBuilder().headers(Auth.header, '123')
      response = await get(UserController, request)
    })

    afterEach(() => {
      Logger.reset('debug')
    })

    it('does not call the controller action', async () => {
      expect(getSpy).not.toHaveBeenCalled()
    })

    it('sets the status to 403', async () => {
      expect(response.status).toEqual(403)
    })

    it('includes the correct errors in the json response', async () => {
      expect(response.json).toEqual({
        errors: expect.arrayContaining(['Forbidden'])
      })
    })

    it('sets the current JWT to null', async () => {
      expect(CurrentJWT.get()).toEqual(null)
    })

    it('doesn\'t call the logger with a success message', async () => {
      expect(Logger.debug).not.toHaveBeenCalledWith({ message: 'Successfully refreshed the JWT. Storing the decoded value.' })
    })
  })
})

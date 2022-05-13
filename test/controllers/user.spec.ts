import { MinimalNewUser, UserController as UController } from '../../src/controllers/user'
import { post, RequestBuilder, ResponseType } from '../../src/test'
import { Auth } from '../../src/auth'
import { NextApiRequest, NextApiResponse } from 'next'

describe('UserController', () => {
  type User = { name: string }
  const createdUser = {
    id: '1',
    email: 'email@email.com',
    name: 'Adam',
  }
  let beforeMock = jest.fn()
  let afterMock = jest.fn()
  class UserController extends UController<User> {
    protected createUser(_userDTO: MinimalNewUser) {
      return Promise.resolve(createdUser)
    }

    protected beforeUserCreation(_req: NextApiRequest, _res: NextApiResponse<any>): void {
      beforeMock()
    }

    protected afterUserCreation(_req: NextApiRequest, _res: NextApiResponse<any>): void {
      afterMock()
    }
  }

  describe('when a post request is sent', () => {
    let response: ResponseType
    let request: RequestBuilder

    describe('when the password and passwordConfirmation match', () => {
      beforeEach(async () => {
        Auth.mock('hash', jest.fn())
        request = new RequestBuilder().body({
          email: 'email',
          password: '123',
          confirmationPassword: '123',
        })

        response = await post(UserController, request)
      })

      afterEach(() => {
        Auth.reset('hash')
      })

      it('returns the new user', () => {
        expect(response.json).toEqual({
          data: {
            user: createdUser,
          },
        })
      })

      it('creates a new hashed password', () => {
        expect(Auth.hash).toHaveBeenCalledWith('123')
      })

      it('calls the beforeUserCreation hook', () => {
        expect(beforeMock).toHaveBeenCalled()
      })

      it('calls the afterUserCreation hook', () => {
        expect(afterMock).toHaveBeenCalled()
      })
    })

    describe('when the password and passwordConfirmation dont match', () => {
      beforeEach(async () => {
        request = new RequestBuilder().body({
          email: 'email',
          password: '123',
          confirmationPassword: '321',
        })
        response = await post(UserController, request)
      })

      it('returns errors', () => {
        expect(response.json).toEqual({
          errors: ['unable to create user'],
        })
      })

      it('has a status of 500', () => {
        expect(response.status).toEqual(500)
      })
    })
  })
})

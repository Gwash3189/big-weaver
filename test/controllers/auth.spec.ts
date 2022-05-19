import { Auth } from '../../src/auth'
import { AuthController as AController } from '../../src/controllers/auth'
import { post, RequestBuilder, ResponseType } from '../../src/test'

describe('AuthController', () => {
  type User = { name: string }
  class AuthController extends AController<User> {
    protected getUser(_email: string): Promise<{ name: string } & { id: string | number; email: string; hashedPassword: string }> {
      return Promise.resolve({
        id: '1',
        email: 'email',
        hashedPassword: '123',
        name: 'Adam',
      })
    }
  }

  describe('when there is a post request', () => {
    describe('when the provided password and hashedPassword match', () => {
      let response: ResponseType
      let request: RequestBuilder

      beforeEach(async () => {
        request = new RequestBuilder().body({
          email: 'email',
          password: '123',
        })
        Auth.mock('setJwt', jest.fn())
        Auth.mock(
          'attempt',
          jest.fn(() => true)
        )
        response = await post(AuthController, request)
      })

      it('returns the user', () => {
        expect(response.json).toEqual({
          data: {
            user: {
              email: 'email',
              hashedPassword: '123',
              id: '1',
              name: 'Adam',
            },
          },
        })
      })

      it('sets the user auth cookie', () => {
        expect(Auth.setJwt).toHaveBeenCalledWith({
          user: {
            id: '1',
          },
        })
      })
    })
    describe('when the provided password and hashedPassword dont match', () => {
      let response: ResponseType
      let request: RequestBuilder

      beforeEach(async () => {
        request = new RequestBuilder().body({
          email: 'email',
          password: '321',
        })
        Auth.mock('setJwt', jest.fn())
        Auth.mock(
          'attempt',
          jest.fn(() => false)
        )
        response = await post(AuthController, request)
      })

      it('returns errors', () => {
        expect(response.json).toEqual({
          errors: ['user not found'],
        })
      })

      it('sets the status to 404', () => {
        expect(response.status).toEqual(404)
      })

      it('does not set the user auth cookie', () => {
        expect(Auth.setJwt).not.toHaveBeenCalled()
      })
    })
  })
})

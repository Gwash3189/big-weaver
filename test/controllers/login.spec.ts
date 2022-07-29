import { NextApiRequest, NextApiResponse } from 'next'
import { Auth } from '../../src/auth'
import { LoginController as LController } from '../../src/controllers/login'
import { post, RequestBuilder } from '../../src/test'

describe('LoginController', () => {
  type User = { name: string }
  let onUserNotFoundSpy: jest.Mock, onPasswordsDontMatchSpy: jest.Mock, onSuccessSpy: jest.Mock
  class LoginController extends LController<User> {
    protected getUser(_email: string): Promise<{ name: string } & { id: string | number; email: string; hashedPassword: string }> {
      return Promise.resolve({
        id: '1',
        email: 'email',
        hashedPassword: '123',
        name: 'Adam',
      })
    }
    protected async onUserNotFound(req: NextApiRequest, res: NextApiResponse): Promise<any> {
      return await onUserNotFoundSpy(req, res)
    }

    protected async onPasswordsDontMatch(req: NextApiRequest, res: NextApiResponse): Promise<any> {
      return await onPasswordsDontMatchSpy(req, res)
    }

    protected async onSuccess(req: NextApiRequest, res: NextApiResponse, user: Record<string, any>): Promise<any> {
      return await onSuccessSpy(req, res, user)
    }
  }

  describe('when there is a post request', () => {
    describe('when the provided password and hashedPassword match', () => {
      let request: RequestBuilder

      beforeEach(async () => {
        onUserNotFoundSpy = jest.fn()
        onPasswordsDontMatchSpy = jest.fn()
        onSuccessSpy = jest.fn()
        request = new RequestBuilder().body({
          email: 'email',
          password: '123',
        })
        Auth.mock('setJwt', jest.fn())
        Auth.mock(
          'attempt',
          jest.fn(() => true)
        )
        await post(LoginController, request)
      })

      it('sets the user auth cookie', () => {
        expect(Auth.setJwt).toHaveBeenCalledWith({
          user: {
            id: '1',
          },
        })
      })

      it('calls onSuccess', () => {
        expect(onSuccessSpy).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), {
          id: '1',
          email: 'email',
          hashedPassword: '123',
          name: 'Adam',
        })
      })
    })

    describe("when the user isn't found", () => {
      let request: RequestBuilder

      class NotFoundController extends LoginController {
        protected getUser(_email: string): Promise<{ name: string } & { id: string | number; email: string; hashedPassword: string }> {
          return Promise.resolve((null as unknown) as any)
        }
      }

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

        await post(NotFoundController, request)
      })

      it('does not set the user auth cookie', () => {
        expect(Auth.setJwt).not.toHaveBeenCalled()
      })

      it('calls onUserNotFound', () => {
        expect(onUserNotFoundSpy).toHaveBeenCalledWith(expect.any(Object), expect.any(Object))
      })
    })

    describe('when the provided password and hashedPassword dont match', () => {
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

        await post(LoginController, request)
      })

      it('does not set the user auth cookie', () => {
        expect(Auth.setJwt).not.toHaveBeenCalled()
      })

      it('calls onPasswordsDontMatch', () => {
        expect(onPasswordsDontMatchSpy).toHaveBeenCalledWith(expect.any(Object), expect.any(Object))
      })
    })
  })
})

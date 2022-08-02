import { UserController as UController } from '../../src/controllers/user'
import { post, RequestBuilder, ResponseType } from '../../src/test'
import { Auth } from '../../src/auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const describeif = (condition: boolean) => (condition ? describe : describe.skip)

describe('UserController', () => {
  type User = { id: string; name: string; email: string; hashedPassword: string }
  let hasValidateUserArgumentsPassed: boolean
  let onUserCreationFailedMock: jest.Mock,
      validateUserArgumentsMock: jest.Mock,
      onUserCreationSuccessMock: jest.Mock,
      onValidateUserArgumentsFailedMock: jest.Mock
  const createdUser = {
    id: '1',
    email: 'email@email.com',
    name: 'Adam',
    hashedPassword: '123',
  }

  class UserController extends UController<User> {
    createUser(_userDTO: unknown) {
      return Promise.resolve(createdUser)
    }

    onUserCreationSuccess(_req: NextApiRequest, _res: NextApiResponse<any>, _user: { id: string; name: string; email: string; hashedPassword: string }): void {
      onUserCreationSuccessMock()
    }

    onUserCreationFailed(_req: NextApiRequest, _res: NextApiResponse<any>, error: Error): void {
      onUserCreationFailedMock(error)
    }

    validateUserArguments(_req: NextApiRequest, _res: NextApiResponse<any>, _userArgument: { email: string; password: string; confirmationPassword: string; hashedPassword: string }): boolean {
      validateUserArgumentsMock()
      return hasValidateUserArgumentsPassed
    }

    onValidateUserArgumentsFailed(_req: NextApiRequest, _res: NextApiResponse<any>): void {
      onValidateUserArgumentsFailedMock()
    }
  }

  beforeEach(() => {
    Auth.mock('setJwt', jest.fn())
    hasValidateUserArgumentsPassed = true
    onUserCreationFailedMock = jest.fn()
    validateUserArgumentsMock = jest.fn()
    onUserCreationSuccessMock = jest.fn()
    onValidateUserArgumentsFailedMock = jest.fn()
  })

  afterEach(() => {
    Auth.reset('setJwt')
  })

  describeif((process.env.INTEGRATION as any) === 'true')('integration tests', () => {
    class IntegrationUserController extends UserController {
      async createUser(
        user: { email: string; password: string; confirmationPassword: string; hashedPassword: string } & { [key: string]: string }
      ): Promise<{ id: string; name: string; email: string; hashedPassword: string }> {
        return await client.user.create({
          data: {
            email: user.email,
            name: 'thisisausername',
            hashedPassword: user.hashedPassword,
          },
        })
      }

      onUserCreationSuccess(_req: NextApiRequest, res: NextApiResponse<any>, user: { id: string; name: string; email: string; hashedPassword: string }): void {
        return res.json({
          data: { user }
        })
      }
    }

    let response: ResponseType
    let request: RequestBuilder
    let client: PrismaClient

    beforeEach(async () => {
      client = new PrismaClient()
      request = new RequestBuilder().body({
        email: 'user@admin.com',
        password: 'thisisapassword',
        confirmationPassword: 'thisisapassword',
      })

      response = await post(IntegrationUserController, request)
    })

    afterEach(async () => {
      await client.user.deleteMany({
        where: {
          email: 'user@admin.com',
        },
      })
    })

    it('returns the user', () => {
      expect(response.json).toEqual({
        data: {
          user: {
            email: 'user@admin.com',
            id: expect.any(String),
            name: 'thisisausername',
            hashedPassword: expect.any(String),
          },
        },
      })
    })
  })

  describe('when a post request is sent', () => {
    let request: RequestBuilder

    describe('when the password and passwordConfirmation match', () => {
      beforeEach(async () => {
        request = new RequestBuilder().body({
          email: 'email',
          password: '123',
          confirmationPassword: '123',
        })

        await post(UserController, request)
      })

      it('calls validateUserArguments', () => {
        expect(validateUserArgumentsMock).toHaveBeenCalled()
      })

      describe('when the validation fails', () => {
        beforeEach(async () => {
          hasValidateUserArgumentsPassed = false
          request = new RequestBuilder().body({
            email: 'email',
            password: '123',
            confirmationPassword: '123',
          })

          await post(UserController, request)
        })

        it('runs onValidateUserArgumentsFails', () => {
          expect(onValidateUserArgumentsFailedMock).toHaveBeenCalled()
        })
      })
    })

    describe('when the password and passwordConfirmation dont match', () => {
      beforeEach(async () => {
        request = new RequestBuilder().body({
          email: 'email',
          password: '123',
          confirmationPassword: '321',
        })

        await post(UserController, request)
      })

      it('runs onUserCreationFailed', () => {
        expect(onUserCreationFailedMock).toHaveBeenCalled()
      })

      it('passes an error to onUserCreationFailed', () => {
        expect(onUserCreationFailedMock).toHaveBeenCalledWith(expect.any(Error))
      })
    })
  })
})

import { UserController as UController } from '../../src/controllers/user'
import { post, RequestBuilder, ResponseType } from '../../src/test'
import { Auth } from '../../src/auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const describeif = (condition: boolean) => (condition ? describe : describe.skip)

describe('UserController', () => {
  type User = { id: string; name: string; email: string; hashedPassword: string }
  const createdUser = {
    id: '1',
    email: 'email@email.com',
    name: 'Adam',
    hashedPassword: '123',
  }
  let beforeMock = jest.fn()
  let afterMock = jest.fn()
  class UserController extends UController<User> {
    protected createUser(_userDTO: unknown) {
      return Promise.resolve(createdUser)
    }

    protected beforeUserCreation(_req: NextApiRequest, _res: NextApiResponse<any>): void {
      beforeMock()
    }

    protected afterUserCreation(_req: NextApiRequest, _res: NextApiResponse<any>): void {
      afterMock()
    }
  }

  beforeEach(() => {
    Auth.mock('setJwt', jest.fn())
  })

  afterEach(() => {
    Auth.reset('setJwt')
  })

  describeif((process.env.INTEGRATION as any) === 'true')('integration tests', () => {
    class UserController extends UController<User> {
      protected async createUser(
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

      protected beforeUserCreation(_req: NextApiRequest, _res: NextApiResponse<any>): void {
        beforeMock()
      }

      protected afterUserCreation(_req: NextApiRequest, _res: NextApiResponse<any>): void {
        afterMock()
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

      response = await post(UserController, request)
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

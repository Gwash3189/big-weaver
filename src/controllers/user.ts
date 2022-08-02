import { NextApiRequest, NextApiResponse } from 'next'
import { Auth } from '../auth'
import { Controller } from '../controller'
import { Logger } from '../logger'
import { getBody } from '../request'

type MinimalNewUserBody = {
  email: string
  password: string
  confirmationPassword: string
}

type MinimalNewUserBodyWithHashedPassword = {
  email: string
  password: string
  confirmationPassword: string
  hashedPassword: string
}

export type MinimalNewUser = Omit<MinimalNewUserBody, 'confirmationPassword'>

export type MinimalUser = {
  id: string | number
  email: string
}

export abstract class UserController<U> extends Controller {
  /**
   * Used in creating a new user at signup. Unauthenticated.
   */
  async post(req: NextApiRequest, res: NextApiResponse) {
    const newUserBody = getBody<MinimalNewUserBody>(req)

    if (newUserBody.password === newUserBody.confirmationPassword) {
      const hashedPassword = await Auth.hash(newUserBody.password)
      const userArguments = {
        ...newUserBody,
        hashedPassword: hashedPassword,
      }

      if(!this.validateUserArguments(req, res, userArguments)) {
        this.onValidateUserArgumentsFailed(req, res)
      }

      try {
        const user = await this.createUser(userArguments)

        if (user === null) {
          Logger.error({ message: `CreateUser in ${this.constructor.name} returned null. Returning 500.` })
          this.onUserCreationFailed(req, res, new Error('createUser returned null'))
        }

        Logger.debug({ message: 'User created' })
        this.onUserCreationSuccess(req, res, user as U)

      } catch (error) {
        this.onUserCreationFailed(req, res, error as Error)
      }

    } else {
      Logger.debug({ message: 'Users passwords do not match' })
      return this.onUserCreationFailed(req, res, new Error('User passwords do not match'))
    }
  }

  abstract createUser(user: MinimalNewUserBodyWithHashedPassword & { [key: string]: string }): Promise<U & { id: string | number } | null>
  abstract onUserCreationFailed(_req: NextApiRequest, res: NextApiResponse, error: Error): void
  abstract onValidateUserArgumentsFailed(_req: NextApiRequest, res: NextApiResponse): void
  abstract validateUserArguments(_req: NextApiRequest, res: NextApiResponse, userArgument: MinimalNewUserBodyWithHashedPassword): boolean
  abstract onUserCreationSuccess(_req: NextApiRequest, _res: NextApiResponse, _user: U): void
}

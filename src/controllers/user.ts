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
  confirmationPassword: string,
  hashedPassword: string
}

export type MinimalNewUser = Omit<MinimalNewUserBody, 'confirmationPassword'>

export type MinimalUser = {
  id: string | number
  email: string
}

export abstract class UserController<U> extends Controller {
  constructor() {
    super()
  }

  /**
   * Used in creating a new user at signup. Unauthenticated.
   */
  async post(req: NextApiRequest, res: NextApiResponse) {
    const newUserBody = getBody<MinimalNewUserBody>(req)

    if (newUserBody.password === newUserBody.confirmationPassword) {
      const hashedPassword = await Auth.hash(newUserBody.password)
      this.beforeUserCreation(req, res)
      const user = await this.createUser({
        ...newUserBody,
        hashedPassword: hashedPassword,
      })

      if (user === null) {
        Logger.error({ message: 'createUser in ${this.constructor.name} returned null. Returning 500.' })
        res.status(500).json({ errors: ['user creation failed'] })
      }

      Logger.debug({ message: 'user created' })
      this.afterUserCreation(req, res, user)
      Auth.setJwt({ user: { id: user.id }})
      return res.json({ data: { user } })
    } else {
      Logger.debug({ message: 'users passwords do not match' })
      return this.cantCreateUser(res)
    }
  }

  protected abstract createUser(user: MinimalNewUserBodyWithHashedPassword & { [key: string]: string }): Promise<(U & { id: string | number })>
  protected beforeUserCreation(_req: NextApiRequest, _res: NextApiResponse): void {}
  protected afterUserCreation(_req: NextApiRequest, _res: NextApiResponse, _user: U): void {}

  private cantCreateUser(res: NextApiResponse) {
    return res.status(500).json({
      errors: ['unable to create user'],
    })
  }
}

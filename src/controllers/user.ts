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

export type MinimalNewUser = Omit<MinimalNewUserBody, 'confirmationPassword'>

export type MinimalUser = {
  id: string | number
  email: string
}

export abstract class UserController<U> extends Controller {
  async post(req: NextApiRequest, res: NextApiResponse) {
    const newUserBody = getBody<MinimalNewUserBody>(req)

    if (newUserBody.password === newUserBody.confirmationPassword) {
      const hashedPassword = await Auth.hash(newUserBody.password)
      this.beforeUserCreation(req, res)
      const user = await this.createUser({
        email: newUserBody.email,
        password: hashedPassword,
      })
      Logger.debug({ message: 'user created' })
      this.afterUserCreation(req, res)
      return res.json({ data: { user } })
    } else {
      Logger.debug({ message: 'users passwords do not match' })
      return this.cantCreateUser(res)
    }
  }

  protected abstract createUser(userMinimalNewUser: MinimalNewUser): Promise<(U & MinimalUser) | null>
  protected beforeUserCreation(_req: NextApiRequest, _res: NextApiResponse): void {}
  protected afterUserCreation(_req: NextApiRequest, _res: NextApiResponse): void {}

  private cantCreateUser(res: NextApiResponse) {
    return res.status(500).json({
      errors: ['unable to create user'],
    })
  }
}

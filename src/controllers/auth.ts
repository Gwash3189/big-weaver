import { NextApiRequest, NextApiResponse } from 'next'
import { Auth } from '../auth'
import { Controller } from '../controller'
import { Logger } from '../logger'
import { getBody } from '../request'

type AuthBody = {
  email: string
  password: string
}

type MinimalUser = {
  id: string | number
  email: string
  hashedPassword: string
}

export abstract class AuthController<U> extends Controller {
  /**
   * Creates a new user login session by setting the JWT cookie
   */
  async post(req: NextApiRequest, res: NextApiResponse) {
    const body = getBody<AuthBody>(req)
    const user = await this.getUser(body.email)

    if (user === null) {
      Logger.debug({
        message: 'user not found',
      })
      return await this.onUserNotFound(req, res)
    }

    const result = await Auth.attempt(body.password, user.hashedPassword)

    if (result === false) {
      Logger.debug({
        message: 'provided password does not match stored hashed password',
      })
      return await this.onPasswordsDontMatch(req, res)
    }

    Logger.debug({ message: 'user found and passwords match' })

    await this.setJwt(user)
    return await this.onSuccess(req, res, user)
  }

  protected abstract getUser(email: string): Promise<(U & MinimalUser) | null>
  protected abstract onUserNotFound(req: NextApiRequest, res: NextApiResponse): Promise<any>
  protected abstract onPasswordsDontMatch(req: NextApiRequest, res: NextApiResponse): Promise<any>
  protected abstract onSuccess(req: NextApiRequest, res: NextApiResponse, user: U & MinimalUser): Promise<any>

  async setJwt(user: U & MinimalUser) {
    return await Auth.setJwt({
      user: {
        id: user.id,
      },
    })
  }
}

import { NextApiRequest, NextApiResponse } from 'next'
import { Auth } from '../auth'
import { Controller } from '../controller'
import { Logger } from '../logger'
import { getBody } from '../request'

type AuthBody = {
  email: string,
  password: string
}

type MinimalUser = {
  id: string | number,
  email: string,
  hashedPassword: string
}

export abstract class AuthController<U> extends Controller {
  async post(req: NextApiRequest, res: NextApiResponse) {
    const body = getBody<AuthBody>(req)
    const user = await this.getUser(body.email)

    if (user === null) {
      Logger.debug({
        message: 'user not found'
      })
      return this.userNotFound(res)
    } else {
      const result  = await Auth.attempt(body.password, user.hashedPassword)

      if (result === false) {
        Logger.debug({
          message: 'provided password does not match stored hashed password'
        })
        return this.userNotFound(res)
      } else {
        Logger.debug({
          message: 'user found and passwords match'
        })
        return res.json({
          user
        })
      }
    }
  }

  protected abstract getUser(email: string): Promise<U & MinimalUser | null>

  private userNotFound(res: NextApiResponse) {
    return res.status(404).json({
      error: 'user not found'
    })
  }
}

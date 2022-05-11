import { Facade } from '../facade'
import { Hash } from '../hash'
import * as JWT from 'jsonwebtoken'
import { Cookie } from '../cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import { Logger } from '../logger'

let secretOrPrivateKey: string | null = null

export class Auth extends Facade {
  static jwtCookie = 'baseline-jwt-cookie'

  static configure(secret: string) {
    secretOrPrivateKey = secret
  }

  static async attempt(password: string, hashedPassword: string) {
    return await Hash.check(password, hashedPassword)
  }

  static async hash(password: string) {
    return await Hash.make(password)
  }

  static async jwt(args: { [key: string]: any }) {
    if (secretOrPrivateKey === null) {
      throw new Error('JWT Secret is not set. Please call Auth.configure to set the secret')
    }

    return await JWT.sign(JSON.stringify(args), secretOrPrivateKey)
  }

  static async set(args: { user: { id: string | number } } | { [key: string]: any }) {
    Cookie.set(this.jwtCookie, Auth.jwt(args), { httpOnly: true, domain: '/' })
  }

  static async verify(_req: NextApiRequest, res: NextApiResponse) {
    const jwtCookie = Cookie.get(this.jwtCookie)

    if (!jwtCookie) {
      return res.status(401)
    }

    if (secretOrPrivateKey === null) {
      Logger.error({ message: 'JWT Secret is not set. Please call Auth.configure to set the secret' })
      return res.status(500)
    }

    const result = await JWT.verify(jwtCookie, secretOrPrivateKey)

    if (!result) {
      return res.status(401)
    }

    return undefined
  }
}

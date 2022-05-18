import { Facade } from '../facade'
import { Hash } from '../hash'
import * as JWT from 'jsonwebtoken'
import { Cookie } from '../cookie'
import { Logger } from '../logger'
import { CookieSerializeOptions } from 'cookie'

let secretOrPrivateKey: string | null = null

export type JWTToken = { [key: string]: any }

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

  static async getJwt(args: JWTToken, options: JWT.SignOptions = { expiresIn: '1h' }): Promise<string> {
    return new Promise((resolve, reject) => {
      if (secretOrPrivateKey === null) {
        reject(new Error('JWT Secret is not set. Please call Auth.configure to set the secret'))
      } else {
        try {
          resolve(JWT.sign(args, secretOrPrivateKey, options))
        } catch (e) {
          reject(e)
        }
      }
    })
  }

  static async setJwt(args: JWTToken, cookieOptions: CookieSerializeOptions = {}, jwtOptions = {}) {
    Cookie.set(this.jwtCookie, await Auth.getJwt(args, jwtOptions), { httpOnly: true, domain: '/', ...cookieOptions })
  }

  static async verify(options: JWT.VerifyOptions = {}) {
    const jwtValue = Cookie.get(this.jwtCookie)

    if (jwtValue === undefined) {
      return false
    } else {
      if (secretOrPrivateKey) {
        try {
          return JWT.verify(jwtValue, secretOrPrivateKey, options)
        } catch (e) {
          const error: Error = e as Error
          Logger.error({ message: error.toString() })

          return false
        }
      } else {
        Logger.error({ message: 'JWT Secret is not set. Please call Auth.configure to set the secret' })
        throw new Error('JWT Secret is not set. Please call Auth.configure to set the secret')
      }
    }
  }

  static async refresh(options: JWT.VerifyOptions = {}) {
    const result = await Auth.verify(options) as JWTToken | false

    if (result !== false) {
      delete result.exp
      delete result.iat

      await Auth.setJwt(result, {}, options)
    }

    return false
  }
}

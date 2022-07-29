import { Facade } from '../facade'
import { Hash } from '../hash'
import * as JWT from 'jsonwebtoken'
import { Cookie } from '../cookie'
import { Logger } from '../logger'
import { CookieSerializeOptions } from 'cookie'
import { AuthEnv } from './env'

export type JWTToken = { [key: string]: any }

export class Auth extends Facade {
  static jwtCookie = 'baseline-jwt-cookie'

  static async attempt(password: string, hashedPassword: string) {
    return await Hash.check(password, hashedPassword)
  }

  static async hash(password: string) {
    return await Hash.make(password)
  }

  static async signJwt(args: JWTToken, options: JWT.SignOptions = { expiresIn: '1h' }): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        resolve(JWT.sign(args, AuthEnv.jwt(), options))
      } catch (e) {
        reject(e)
      }
    })
  }

  static async removeJwt() {
    Cookie.remove(this.jwtCookie)
  }

  static async setJwt(args: JWTToken, cookieOptions: CookieSerializeOptions = {}, jwtOptions: JWT.SignOptions = { expiresIn: '1h' }) {
    Cookie.set(this.jwtCookie, await Auth.signJwt(args, jwtOptions), { httpOnly: true, domain: '/', ...cookieOptions })
  }

  static async verify(options: JWT.VerifyOptions = {}) {
    const jwtValue = Cookie.get(this.jwtCookie)

    if (jwtValue === undefined) {
      return false
    } else {
      try {
        return JWT.verify(jwtValue, AuthEnv.jwt(), options)
      } catch (e) {
        const error: Error = e as Error
        Logger.error({ message: error.toString() })

        return false
      }
    }
  }

  static async refresh(verifyOptions: JWT.VerifyOptions = {}, signOptions: JWT.SignOptions = { expiresIn: '1h' }) {
    const result = (await Auth.verify(verifyOptions)) as JWTToken | false

    if (result !== false) {
      delete result.exp
      delete result.iat

      await Auth.setJwt(result, {}, signOptions)
      return result
    }

    return false
  }
}

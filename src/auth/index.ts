import { Facade } from '../facade'
import { Hash } from '../hash'
import * as JWT from 'jsonwebtoken'
import { AuthEnv } from '../auth/env'
import { NetworkJar, RequestKey, ResponseKey } from '../network-jar'
import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from '../session'

type Uuid = string
export interface DecodedJwtToken {
  user: {
    id: Uuid
  }
  account: {
    id: Uuid
  }
}

export class Auth extends Facade {
  static header = 'x-auth-token'
  static verify (token: string, secret: string): DecodedJwtToken {
    return JWT.verify(token, secret) as DecodedJwtToken
  }

  static createJwt (payload: DecodedJwtToken): string {
    return JWT.sign(payload, AuthEnv.jwtSecret(), {
      expiresIn: '10m'
    })
  }

  static setAuthTokenHeader (token: string): void {
    const response = NetworkJar.get<NextApiResponse>(ResponseKey)
    response.setHeader(Auth.header, token)
  }

  static getAuthToken (): string {
    const request = NetworkJar.get<NextApiRequest>(RequestKey)
    return request.headers[Auth.header] as string
  }

  static async checkPasswords (password: string, hashedPassword: string): Promise<boolean> {
    return await Hash.check(password, hashedPassword)
  }

  static async hash (password: string): Promise<string> {
    return await Hash.make(password)
  }

  static async refreshAuthToken (jwtRecord: DecodedJwtToken): Promise<DecodedJwtToken> {
    const { token, verified } = await new Auth().createToken(jwtRecord)
    Auth.setAuthTokenHeader(token)
    return verified
  }

  static async setSessionToken (jwtRecord: DecodedJwtToken): Promise<DecodedJwtToken> {
    const { token, verified } = await new Auth().createToken(jwtRecord)
    Session.set(Auth.header, token)
    return verified
  }

  private async createToken (jwtRecord: DecodedJwtToken): Promise<{ token: string, verified: DecodedJwtToken }> {
    const token = await Auth.createJwt({
      user: {
        id: jwtRecord.user.id
      },
      account: {
        id: jwtRecord.account.id
      }
    })
    const verified = Auth.verify(token, AuthEnv.jwtSecret())

    return {
      token,
      verified
    }
  }
}

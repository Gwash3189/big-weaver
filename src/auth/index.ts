import { Facade } from '@/facade'
import { Hash } from '@/hash'
import * as JWT from 'jsonwebtoken'
import { AuthEnv } from '@/auth/env'
import { NetworkJar, RequestKey, ResponseKey } from '@/network-jar'
import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from '@/session'

type Uuid = string
export type DecodedJwtToken = {
  user: {
    id: Uuid
  }
  account: {
    id: Uuid
  }
}

export class Auth extends Facade {
  static header = 'x-auth-token'
  static verify(token: string, secret: string) {
    return JWT.verify(token, secret) as DecodedJwtToken
  }

  static createJwt(payload: DecodedJwtToken) {
    return JWT.sign(payload, AuthEnv.jwtSecret(), {
      expiresIn: '10m',
    })
  }

  static setAuthTokenHeader(token: string) {
    const response = NetworkJar.get<NextApiResponse>(ResponseKey)
    response.setHeader(Auth.header, token)
  }

  static getAuthToken() {
    const request = NetworkJar.get<NextApiRequest>(RequestKey)
    return request.headers[Auth.header] as string
  }

  static checkPasswords(password: string, hashedPassword: string) {
    return Hash.check(password, hashedPassword)
  }

  static hash(password: string) {
    return Hash.make(password)
  }

  static async refreshAuthToken(jwtRecord: DecodedJwtToken) {
    const { token, verified } = await new Auth().createToken(jwtRecord)
    Auth.setAuthTokenHeader(token)
    return verified
  }

  static async setSessionToken(jwtRecord: DecodedJwtToken) {
    const { token, verified } = await new Auth().createToken(jwtRecord)
    Session.set(Auth.header, token)
    return verified
  }

  private async createToken(jwtRecord: DecodedJwtToken) {
    const token = await Auth.createJwt({
      user: {
        id: jwtRecord.user.id,
      },
      account: {
        id: jwtRecord.account.id,
      },
    })
    const verified = Auth.verify(token, AuthEnv.jwtSecret())

    return {
      token,
      verified,
    }
  }
}

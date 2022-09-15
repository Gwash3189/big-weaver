import { NextApiRequest, NextApiResponse } from 'next'
import { Auth } from '..'
import { Facade } from '../../facade'
import { Logger } from '../../logger'
import { AuthEnv } from '../../auth/env'

class JWTJar extends Facade {
  constructor (private value: any | null) {
    super()
  }

  set (value: any): void {
    this.value = value
  }

  get<T>(): T {
    return this.value as T
  }
}

export const CurrentJWT = new JWTJar(null)

export class Protected extends Facade {
  static async middleware (_req: NextApiRequest, res: NextApiResponse, stop: () => void): Promise<void> {
    Logger.debug({ message: 'Attempting to refresh the JWT for the incoming request' })
    const token = await Auth.getAuthToken()

    try {
      Logger.debug({ message: 'Attempting to decode & verify the current token.' })
      const decodedToken = await Auth.verify(token, AuthEnv.jwtSecret())
      const result = await Auth.refreshAuthToken(decodedToken)
      Logger.debug({ message: 'Successfully refreshed the JWT. Storing the decoded value.' })
      CurrentJWT.set(result)
    } catch (error) {
      Logger.debug({ message: 'Refreshing the JWT failed. Sending 403.' })
      stop()
      CurrentJWT.set(null)

      return res.status(403).json({
        errors: [
          'Forbidden'
        ]
      })
    }
  }
}

import { NextApiRequest, NextApiResponse } from "next"
import { Auth } from ".."
import { Facade } from "../../facade"
import { Logger } from "../../logger"

class JWTJar extends Facade {
  constructor(private value: any | null) {
    super()
  }

  set(value: any) {
    this.value = value
  }

  get<T>() {
    return this.value as T
  }
}

export const CurrentJWT = new JWTJar(null)

export class Protected extends Facade {
  static async middleware(_req: NextApiRequest, res: NextApiResponse, stop: () => void) {
    Logger.debug({ message: 'Attempting to refresh the JWT for the incoming request' })
    const result = await Auth.refresh()

    if (result === false) {
      Logger.debug({ message: 'Refreshing the JWT failed. Sending 403.' })
      stop()
      CurrentJWT.set(null)

      res.status(403).json({ errors: [
        'Forbidden'
      ]})
    }

    Logger.debug({ message: 'Successfully refreshed the JWT. Storing the decoded value.' })
    CurrentJWT.set(result)
  }
}

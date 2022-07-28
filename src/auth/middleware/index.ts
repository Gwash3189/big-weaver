import { NextApiRequest, NextApiResponse } from "next"
import { Auth } from ".."
import { Facade } from "../../facade"

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
    const result = await Auth.refresh()

    if (result === false) {
      stop()
      CurrentJWT.set(null)

      res.status(403).json({ errors: [
        'Forbidden'
      ]})
    }

    CurrentJWT.set(result)
  }
}

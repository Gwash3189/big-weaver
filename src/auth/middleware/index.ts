import { NextApiRequest, NextApiResponse } from "next"
import { Auth } from ".."
import { Facade } from "../../facade"

export class Protected extends Facade {
  static async middleware(_req: NextApiRequest, res: NextApiResponse, stop: () => void) {
    const result = await Auth.refresh()

    if (result === false) {
      stop()

      res.status(403).json({ errors: [
        'Forbidden'
      ]})
    }
  }
}

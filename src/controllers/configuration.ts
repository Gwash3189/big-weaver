import { NextApiRequest, NextApiResponse } from 'next'
import { Controller } from '../controller'

let configured = false

export class ConfigurationController extends Controller {
  static configured() {
    return configured
  }

  constructor() {
    super()

    this.before((_req, _res, stop) => {
      if (configured) {
        stop()
      }
    })

    this.after(() => {
      this.complete()
    })
  }

  get(_request: NextApiRequest, res: NextApiResponse) {
    return res.json({ complete: configured })
  }

  complete() {
    configured = true
  }

  reset() {
    configured = false
  }
}

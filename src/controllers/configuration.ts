import { NextApiRequest, NextApiResponse } from 'next'
import { Controller } from '../controller'

let configured = false

export class ConfigurationController extends Controller {
  constructor() {
    super()

    this.before((_req, stop) => {
      configured ? stop() : undefined
    })

    this.after((_req, _res, _stop) => {
      this.complete()
    })
  }

  get(_request: NextApiRequest, res: NextApiResponse) {
    return res.json({ complete: configured })
  }

  complete() {
    configured = true
  }
}

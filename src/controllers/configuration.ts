import { NextApiRequest, NextApiResponse } from 'next'
import { Auth } from '../auth'
import { Controller } from '../controller'
import { Env } from '../env'
import { Logger } from '../logger'

let configured = false
const JWT_SECRET_KEY = 'JWT_SECRET'

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

    this.before(() => {
      if (!Env.exists(JWT_SECRET_KEY)) {
        Logger.debug({ message: 'no process.env.JWT_SECRET set, defaulting to development secret' })
        Auth.configure('secret')
      } else {
        Logger.debug({ message: 'configuring Auth with provided process.env.JWT_SECRET' })
        Auth.configure(Env.get(JWT_SECRET_KEY) as string)
      }
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

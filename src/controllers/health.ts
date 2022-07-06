import { NextApiRequest, NextApiResponse } from 'next'
import { Controller } from '../controller'
import { ConfigurationController } from './configuration'

export class HealthController extends Controller {
  static checks() {
    return [ConfigurationController.configured]
  }

  get(_request: NextApiRequest, res: NextApiResponse) {
    const alive = HealthController.checks().every(check => check())

    res.json({ alive })
  }
}

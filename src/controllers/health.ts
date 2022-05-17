import { NextApiRequest, NextApiResponse } from 'next'
import { Controller } from '../controller'
import { ConfigurationController } from './configuration'

export class HealthController extends Controller {
  get(_request: NextApiRequest, res: NextApiResponse) {
    const checks = [ConfigurationController.configured()].every(result => result)

    res.json({ alive: checks })
  }
}

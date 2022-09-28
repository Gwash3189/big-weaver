import { NextApiRequest, NextApiResponse } from 'next'
import { AppController } from './app-controller'

export class HealthController extends AppController {
  static checks (): [() => true] {
    return [() => true]
  }

  get (_request: NextApiRequest, res: NextApiResponse): void {
    const alive = HealthController.checks().every(check => check())

    res.json({ alive })
  }
}

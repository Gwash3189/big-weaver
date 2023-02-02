import { NextApiRequest, NextApiResponse } from 'next'
import { AppController } from './app-controller'

type Response = { alive: boolean }

export class HealthController extends AppController {
  static checks (): (() => boolean)[] {
    return [() => true]
  }

  get(_request: NextApiRequest, response: NextApiResponse<Response>): void {
    const alive = HealthController
      .checks()
      .every(check => check())

    response.json({ alive })
  }
}

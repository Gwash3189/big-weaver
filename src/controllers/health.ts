import { NextApiRequest, NextApiResponse } from 'next'
import { AppController } from './app-controller'

interface Response { alive: boolean }

export class HealthController extends AppController {
  static checks (): Array<() => boolean> {
    return [() => true]
  }

  async get (_request: NextApiRequest, response: NextApiResponse<Response>): Promise<void> {
    const alive = HealthController
      .checks()
      .every(check => check())

    response.json({ alive })
  }
}

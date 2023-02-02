import { NextApiRequest, NextApiResponse } from 'next'
import { getQuery } from 'src/request'
import { AppController } from './app-controller'

type HealthControllerGetResponse = { alive: boolean }

export class HealthController extends AppController {
  static checks (): [() => true] {
    return [() => true]
  }

  get<HealthControllerGetResponse>(_request: NextApiRequest, response: NextApiResponse<HealthControllerGetResponse>): void {
    const alive = HealthController.checks().every(check => check())
    getQuery

    response.json({ alive })
  }
}

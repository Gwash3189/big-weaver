import { NextApiRequest, NextApiResponse } from 'next'
import { Controller } from '@/controller'

export class HealthController extends Controller {
  static checks (): [() => true] {
    return [() => true]
  }

  get (_request: NextApiRequest, res: NextApiResponse): void {
    const alive = HealthController.checks().every(check => check())

    res.json({ alive })
  }
}

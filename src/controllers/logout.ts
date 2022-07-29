import { NextApiRequest, NextApiResponse } from 'next'
import { Auth } from '../auth'
import { Controller } from '../controller'

export abstract class LogoutController extends Controller {
  /**
   * Destorys the current login session
   */
  async get(req: NextApiRequest, res: NextApiResponse) {
    await Auth.removeJwt()
    return await this.onSuccess(req, res)
  }

  protected abstract onSuccess(req: NextApiRequest, res: NextApiResponse): Promise<any>
}

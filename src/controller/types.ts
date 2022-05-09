import { NextApiRequest, NextApiResponse } from 'next'

export type ActionReturn = void | Promise<any>
export type Action = (req: NextApiRequest, res: NextApiResponse) => ActionReturn
export interface IController {
  get: Action
  put: Action
  delete: Action
  post: Action
  patch: Action
  head: Action
  options: Action
}
export type Middleware = (req: NextApiRequest, res: NextApiResponse, stop: () => void) => ActionReturn

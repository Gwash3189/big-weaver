import { NextApiRequest, NextApiResponse } from 'next'
import { AfterMiddleware, BeforeMiddleware } from './middleware'

export type ActionReturn = void | Promise<any>
export type Action = (req: NextApiRequest, res: NextApiResponse) => ActionReturn
export interface IController {
  get?: Action
  put?: Action
  delete?: Action
  post?: Action
  patch?: Action
  head?: Action
  options?: Action
}
export type Before = (req: NextApiRequest) => ActionReturn
export type After = (req: NextApiRequest, res: NextApiResponse) => ActionReturn
export type Middleware = Before | After

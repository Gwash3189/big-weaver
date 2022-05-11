import { NextApiRequest, NextApiResponse } from 'next'

export type ActionReturn = void | Promise<any>
export type Action = (req: NextApiRequest, res: NextApiResponse) => ActionReturn
export type Middleware = (req: NextApiRequest, res: NextApiResponse, stop: () => void) => ActionReturn

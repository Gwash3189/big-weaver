import { NextApiRequest, NextApiResponse } from 'next'

export type Action = (...dependencies: any) => (req: NextApiRequest, res: NextApiResponse) => void | Promise<any>

export type HandlerConfig = {
  get?: Action
  post?: Action
  put?: Action
  delete?: Action
}

export function register(config: HandlerConfig) {
  return function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
      case 'GET': // eslint-disable-line no-fallthrough
        if (config.get) {
          return config.get()(req, res)
        }
        break
      case 'PUT': // eslint-disable-line no-fallthrough
        if (config.put) {
          return config.put()(req, res)
        }
        break
      case 'DELETE': // eslint-disable-line no-fallthrough
        if (config.delete) {
          return config.delete()(req, res)
        }
        break
      case 'POST': // eslint-disable-line no-fallthrough
        if (config.post) {
          return config.post()(req, res)
        }
        break
      default:
        // eslint-disable-line no-fallthrough
        res.setHeader(
          'Allow',
          Object.keys(config).map(methodName => methodName.toUpperCase())
        )
        res.status(405).end(`Method ${req.method} Not Allowed`)
        break
    }
  }
}

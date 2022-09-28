import { NextApiRequest, NextApiResponse } from 'next'
import { Jar } from './jar'

export const ResponseKey = 'response'
export const RequestKey = 'request'

export class NetworkContainer extends Jar<NextApiRequest | NextApiResponse> {
  request (): NextApiRequest {
    return this.jar.get(RequestKey) as NextApiRequest
  }

  response (): NextApiResponse {
    return this.jar.get(ResponseKey) as NextApiResponse
  }
}

export const NetworkJar = new NetworkContainer()

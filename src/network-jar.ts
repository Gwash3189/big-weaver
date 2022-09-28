import { NextApiRequest, NextApiResponse } from 'next'
import { Jar } from './jar'

export const ResponseKey = 'response'
export const RequestKey = 'request'

export class NetworkContainer extends Jar<NextApiRequest | NextApiResponse> {
  readonly container: Jar<NextApiRequest | NextApiResponse>

  constructor () {
    super()

    this.container = new Jar<NextApiRequest | NextApiResponse>()
  }

  request (): NextApiRequest {
    return this.container.get<NextApiRequest>(RequestKey)
  }

  response (): NextApiResponse {
    return this.container.get<NextApiResponse>(ResponseKey)
  }
}

export const NetworkJar = new NetworkContainer()

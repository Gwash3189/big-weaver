import { NextApiRequest } from 'next'
import { z } from 'zod'
import { Facade } from '..'
import { NetworkJar, RequestKey } from '../network-jar'

export class Parameters extends Facade {
  public query: Record<string, any>
  public body: Record<string, any>

  constructor (request: NextApiRequest) {
    super()

    this.query = request.query
    this.body = request.body
  }

  static get () {
    const request = NetworkJar.get<NextApiRequest>(RequestKey)
    return new Parameters(request)
  }

  // eslint-disable-next-line
  validate (options: z.ZodTypeAny) {
    return options.safeParse({
      query: this.query,
      body: this.body
    })
  }
}

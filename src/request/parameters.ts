import { NextApiRequest } from 'next'
import { Facade } from '..'
import { NetworkJar, RequestKey } from '../network-jar'

export class Parameters extends Facade {
  public _query: Record<string, any>
  public _body: Record<string, any>

  constructor (request: NextApiRequest) {
    super()

    this._query = request.query
    this._body = request.body
  }

  static get () {
    const request = NetworkJar.get<NextApiRequest>(RequestKey)
    return new Parameters(request)
  }

  query<T = Record<string, any>>() {
    return this._query as T
  }

  body<T = Record<string, any>>() {
    return this._body as T
  }
}

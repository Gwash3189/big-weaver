import { NextApiRequest } from 'next'
import { Facade } from '..'
import { NetworkJar } from '../network-jar'

export class Parameters extends Facade {
  public _query: Record<string, any>
  public _body: Record<string, any>

  constructor (request: NextApiRequest) {
    super()

    this._query = request.query
    this._body = request.body
  }

  static get (): Parameters {
    return new Parameters(NetworkJar.request())
  }

  query<T = Record<string, any>>(): T {
    return this._query as T
  }

  body<T = Record<string, any>>(): T {
    return this._body as T
  }
}

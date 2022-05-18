import { NextApiRequest, NextApiResponse } from 'next'
import { Facade } from './facade'
import { serialize, CookieSerializeOptions } from 'cookie'
import { RequestKey, ResponseKey } from './network-jar'
import { NetworkJar } from './network-jar'

export class Cookie extends Facade {
  static set(name: string, value: any, options: CookieSerializeOptions = {}) {
    const response = NetworkJar.get<NextApiResponse>(ResponseKey)
    response.setHeader('Set-Cookie', [...((response.getHeader('Set-Cookie') as Array<string> | undefined) || []), serialize(name, value, options)])
  }

  static get(name: string): string | undefined {
    const request = NetworkJar.get<NextApiRequest>(RequestKey)
    return request.cookies[name]
  }

  static remove(name: string) {
    const date = new Date()
    date.setDate(date.getDate() - 5)
    this.set(name, '', { expires: date })
  }
}

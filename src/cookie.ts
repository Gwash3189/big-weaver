import { NextApiRequest, NextApiResponse } from 'next'
import { container } from 'tsyringe'
import { Facade } from './facade'
import { serialize, CookieSerializeOptions } from 'cookie'
import { RequestKey, ResponseKey } from './container'

class CookieImplementation extends Facade {
  set(name: string, value: any, options: CookieSerializeOptions = {}) {
    const response = container.resolve<NextApiResponse>(ResponseKey)
    response.setHeader('Set-Cookie', [...((response.getHeader('Set-Cookie') as Array<string> | undefined) || []), serialize(name, value, options)])
  }

  get(name: string) {
    const request = container.resolve<NextApiRequest>(RequestKey)
    return request.cookies[name]
  }

  remove(name: string) {
    const date = new Date()
    date.setDate(date.getDate() - 5)
    this.set(name, '', { expires: date })
  }
}

export const Cookie = Facade.create(CookieImplementation)

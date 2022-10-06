import { Facade } from '../facade'
import Cookies from 'cookies'
import { NetworkJar, RequestKey, ResponseKey } from '../network-jar'
import { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'

export type SessionValue = Record<string, any> | Array<Record<string, any>> | string

export class Session extends Facade {
  static set (name: string, value: SessionValue | string, options: Cookies.SetOption = {}): void {
    const request = NetworkJar.get<NextApiRequest>(RequestKey)
    const response = NetworkJar.get<NextApiResponse>(ResponseKey)
    const cookies = new Cookies(request, response)

    cookies.set(name, JSON.stringify(value), {
      path: '/',
      ...options
    })
  }

  static get<T> (name: string, defaultValue: T): T {
    const request = NetworkJar.get<NextApiRequest>(RequestKey)
    const response = NetworkJar.get<NextApiResponse>(ResponseKey)
    const cookies = new Cookies(request, response)
    try {
      return JSON.parse(cookies.get(name) ?? '') as T
    } catch {
      return defaultValue
    }
  }

  static clear (name: string): void {
    const request = NetworkJar.get<NextApiRequest>(RequestKey)
    const response = NetworkJar.get<NextApiResponse>(ResponseKey)

    const cookies = new Cookies(request, response)
    cookies.set(name, '', {
      path: '/',
      expires: dayjs(Date.now())
        .subtract(7, 'months')
        .toDate()
    })
  }
}

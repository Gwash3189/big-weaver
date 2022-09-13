import { Facade } from '@/facade'
import Cookies from 'cookies'
import { NetworkJar, RequestKey, ResponseKey } from '@/network-jar'
import { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'

export type SessionValue = Record<string, any> | Array<Record<string, any>> | string

export class Session extends Facade {
  static set(name: string, value: SessionValue | string, options: Cookies.SetOption = {}) {
    const request = NetworkJar.get<NextApiRequest>(RequestKey)
    const response = NetworkJar.get<NextApiResponse>(ResponseKey)
    const cookies = new Cookies(request, response)

    cookies.set(name, JSON.stringify(value), {
      path: '/',
      expires: dayjs(Date.now())
        .add(7, 'days')
        .toDate(),
      ...options,
    })
  }

  static get(name: string, defaultValue: any = undefined) {
    const request = NetworkJar.get<NextApiRequest>(RequestKey)
    const response = NetworkJar.get<NextApiResponse>(ResponseKey)
    const cookies = new Cookies(request, response)
    try {
      return JSON.parse(cookies.get(name) || '')
    } catch {
      return defaultValue
    }
  }

  static clear(name: string) {
    const request = NetworkJar.get<NextApiRequest>(RequestKey)
    const response = NetworkJar.get<NextApiResponse>(ResponseKey)

    const cookies = new Cookies(request, response)
    cookies.set(name, '', {
      path: '/',
      expires: dayjs(Date.now())
        .subtract(7, 'months')
        .toDate(),
    })
  }
}

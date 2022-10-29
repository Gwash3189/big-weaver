import { Facade } from '../facade'
import Cookies from 'cookies'
import { NetworkJar } from '../network-jar'
import dayjs from 'dayjs'

export type SessionValue = Record<string, any> | Array<Record<string, any>> | string

export class Session extends Facade {
  static set (name: string, value: SessionValue | string, options: Cookies.SetOption = {}): void {
    const cookies = new Cookies(
      NetworkJar.request(),
      NetworkJar.response()
    )

    cookies.set(name, JSON.stringify(value), {
      path: '/',
      ...options
    })
  }

  static get<T> (name: string, defaultValue: T): T {
    const cookies = new Cookies(
      NetworkJar.request(),
      NetworkJar.response()
    )

    try {
      return JSON.parse(cookies.get(name) ?? '') as T
    } catch {
      return defaultValue
    }
  }

  static clear (name: string): void {
    const cookies = new Cookies(
      NetworkJar.request(),
      NetworkJar.response()
    )

    cookies.set(name, '', {
      path: '/',
      expires: dayjs(Date.now())
        .subtract(7, 'months')
        .toDate()
    })
  }
}

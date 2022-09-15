import Cookies from 'cookies'
import { Facade } from './facade'
import { NextApiRequest, NextApiResponse } from 'next'
import { NetworkJar, RequestKey, ResponseKey } from './network-jar'

export class Cookie extends Facade {
  get<T>(name: string, defaultValue: T): T {
    const request = NetworkJar.get<NextApiRequest>(RequestKey)
    const response = NetworkJar.get<NextApiResponse>(ResponseKey)

    return new Cookies(request, response).get(name) as T ?? defaultValue
  }

  set (name: string, value: any, options: Cookies.SetOption = {}): void {
    const request = NetworkJar.get<NextApiRequest>(RequestKey)
    const response = NetworkJar.get<NextApiResponse>(ResponseKey)

    new Cookies(request, response).set(name, JSON.stringify(value), options)
  }
}

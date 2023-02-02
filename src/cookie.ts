import Cookies from 'cookies'
import { Facade } from './facade'
import { NetworkJar } from './network-jar'

export class Cookie extends Facade {
  static get<T>(name: string, defaultValue: T): T {
    const request = NetworkJar.request()
    const response = NetworkJar.response()

    return new Cookies(request, response).get(name) as T ?? defaultValue
  }

  static set (name: string, value: any, options: Cookies.SetOption = {}): void {
    const request = NetworkJar.request()
    const response = NetworkJar.response()

    new Cookies(request, response).set(name, JSON.stringify(value), options)
  }
}

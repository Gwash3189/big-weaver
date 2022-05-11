import { Facade } from './facade'

export class Env extends Facade {
  static get(name: string) {
    return process.env[name]
  }

  static exists(name: string) {
    return Boolean(this.get(name))
  }

  static production() {
    return process.env.NODE_ENV === 'production'
  }

  static dev() {
    return process.env.NODE_ENV === 'development'
  }

  static test() {
    return process.env.NODE_ENV === 'test'
  }
}

import { Facade } from './facade'

export class Env extends Facade {
  static get (name: string): string | undefined {
    return process.env[name]
  }

  static exists (name: string): boolean {
    return Boolean(this.get(name))
  }

  static production (): boolean {
    return process.env.NODE_ENV === 'production'
  }

  static dev (): boolean {
    return process.env.NODE_ENV === 'development'
  }

  static test (): boolean {
    return process.env.NODE_ENV === 'test'
  }
}

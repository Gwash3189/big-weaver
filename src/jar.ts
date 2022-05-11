import { Facade } from './facade'

export class Jar<U> extends Facade {
  protected jar: Map<string, U>

  constructor() {
    super()

    this.jar = new Map<string, U>()
  }

  set(name: string, instance: U) {
    this.jar.set(name, instance)
  }

  get<T>(name: string) {
    const item = this.jar.get(name)

    if (item === undefined) {
      throw new Error(`${name} not found in Jar`)
    }

    return (item as unknown) as T
  }
}

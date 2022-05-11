import { constructor } from "./types"

export class Jar<U> {
  private jar: Map<string, U>

  constructor() {
    this.jar = new Map<string, U>()
  }

  set(name: string, instance: constructor<U>) {
    return this.jar.set(name, new instance)
  }

  get(name: string) {
    const item = this.jar.get(name)

    if (item === undefined) {
      throw new Error(`${name} not found in Jar`)
    }

    return item
  }
}

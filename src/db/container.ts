import { Jar } from "../jar"
import { constructor } from "../types"

export class Container {
  private container: Jar<any>

  constructor() {
    this.container = new Jar()
  }

  find<T>(repository: constructor<T>): T {
    return this.container.get<T>(repository.constructor.name)
  }

  set<T>(repository: constructor<T>): void {
    this.container.set(repository.constructor.name, new (repository as constructor<T>)())
  }
}

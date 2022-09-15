import { Jar } from '../jar'
import { constructor } from '../types'

export class Container {
  private readonly container: Jar<any>

  constructor () {
    this.container = new Jar()
  }

  find<T>(repository: constructor<T>): T {
    return this.container.get<T>(repository.name)
  }

  set<T>(Repository: constructor<T>): void {
    this.container.set(Repository.name, new (Repository)())
  }
}

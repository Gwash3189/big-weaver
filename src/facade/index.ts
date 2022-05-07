import { container } from 'tsyringe'
import { constructor } from 'tsyringe/dist/typings/types'

export class Facade {
  static create<T>(klass: constructor<T>) {
    container.registerSingleton(`original-${klass.name}`, klass)
    return (new Proxy(klass, {
      get(_target, propKey, receiver) {
        const instance = container.resolve(`original-${klass.name}`)
        return Reflect.get(instance as Object, propKey, receiver)
      },
    }) as unknown) as T
  }

  replace(repalcement: constructor<Facade>) {
    container.registerSingleton(`original-${this.constructor.name}`, (repalcement as unknown) as constructor<Facade>)
  }

  spyOn(methodName: string, j: typeof jest) {
    return j.spyOn(this.constructor.prototype, methodName)
  }

  mock(methodName: string, imple: (...args: any[]) => unknown, j: typeof jest) {
    const instance = container.resolve<Object>(`original-${this.constructor.name}`)
    const c = class extends (instance.constructor as any) {
      constructor(...args: any[]) {
        super(...args)
        this[methodName] = j.fn(imple)
      }
    }

    this.replace((c as unknown) as typeof Facade)
  }
}

import { container } from 'tsyringe'
import { constructor } from 'tsyringe/dist/typings/types'

export class Facade {
  static create<T>(klass: constructor<T>) {
    return (new Proxy(klass, {
      get(_target, propKey, receiver) {
        const instance = container.resolve(klass)
        const targetValue = Reflect.get(instance as Object, propKey, receiver)
        if (typeof targetValue === 'function') {
          return function(...args: any[]) {
            return targetValue.apply(instance, args)
          }
        } else {
          return targetValue
        }
      },
    }) as unknown) as T
  }
}

const MethodJar = new Map<string, Function>()

const getName = (item: any): string => {
  if (typeof item === 'function') {
    return item.name
  }
  if (typeof item === 'object') {
    return item.constructor.name
  }

  throw new Error('Unable to find name for incoming item')
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Facade {
  static mock (method: string, imple: () => any): void {
    MethodJar.set(`${getName(this)}-${method}`, (this as { [key: string]: any })[method])
    ;(this as { [key: string]: any })[method] = imple
  }

  static reset (...methods: string[]): void {
    methods.forEach(method => {
      ;(this as { [key: string]: any })[method] = MethodJar.get(`${getName(this)}-${method}`)
    })
  }
}

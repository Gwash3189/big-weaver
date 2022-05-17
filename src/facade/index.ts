const MethodJar = new Map<string, Function>()

const getName = (item: any) => {
  if (typeof item === 'function') {
    return item.name
  }
  if (typeof item === 'object') {
    return item.constructor.name
  }
}

export class Facade {
  static mock(method: string, imple: () => any) {
    MethodJar.set(`${getName(this)}-${method}`, (this as { [key: string]: any })[method])
    ;(this as { [key: string]: any })[method] = imple
  }

  static reset(...methods: string[]) {
    methods.forEach(method => {
      ;(this as { [key: string]: any })[method] = MethodJar.get(`${getName(this)}-${method}`)
    })
  }
}

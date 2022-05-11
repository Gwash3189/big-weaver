const MethodJar = new Map<string, Function>()

export class Facade {
  static mock(method: string, imple: () => any) {
    MethodJar.set(`${this.name}-${method}`, (this as { [key: string]: any })[method])
    ;(this as { [key: string]: any })[method] = imple
  }

  static reset(...methods: string[]) {
    methods.forEach(method => {
      ;(this as { [key: string]: any })[method] = MethodJar.get(`${this.name}-${method}`)
    })
  }
}

import 'reflect-metadata'
import { Facade } from '../src/facade'

class TestClass {
  constructor(public name: string = 'Facade') {}

  hello() {
    return `hello, ${this.name}`
  }
}

describe('Facade', () => {
  let klass: TestClass | null = null

  beforeEach(() => {
    klass = Facade.create(TestClass)
  })

  describe('#create', () => {
    it('proxies static methods to instance methods', () => {
      expect(klass?.hello()).toEqual('hello, Facade')
    })

    it('allows us to access values', () => {
      expect(klass?.name).toEqual('Facade')
    })
  })
})

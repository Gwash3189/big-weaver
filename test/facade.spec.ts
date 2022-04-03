import 'reflect-metadata'

import { DependencyContainer } from 'tsyringe'
import { Facade } from '../src/facade'

class TestClass {
  constructor(public name: string = 'Facade') {}

  hello() {
    return `hello, ${this.name}`
  }
}

describe('Facade', () => {
  let klass: TestClass | null = null
  let container = () => {
    return {
      resolve: () => {
        return new TestClass()
      }
    }
  }

  beforeEach(() => {
    klass = Facade.create(TestClass, (container as unknown as () => DependencyContainer))
  })

  describe('#create', () => {
    it('proxies static methods to instance methods', () => {
      expect((klass as TestClass).hello()).toEqual('hello, Facade')
    })

    it('allows us to access values', () => {
      expect((klass as TestClass).name).toEqual('Facade')
    })
  })
})

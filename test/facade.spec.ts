import 'reflect-metadata'
import { Facade } from '../src/facade'



describe('Facade', () => {
  class TestClass {
    constructor(public name: string = 'Facade') {}

    hello() {
      return `hello, ${this.name}`
    }
  }
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

  describe('#replace', () => {
    class TestFacadeImplementation extends Facade {
      hello(number: number) {
        return `${number}`
      }
    }
    class Replacement extends Facade {
      mock = jest.fn()

      hello(...args: any[]) {
        this.mock(...args)
      }
    }

    const TestFacade = Facade.create(TestFacadeImplementation)

    beforeEach(() => {
      TestFacade
        .replace(Replacement)

      TestFacade.hello(123123)
    })

    afterEach(() => {
      TestFacade.replace(TestFacadeImplementation)
    })

    it('replaces the registered facade with the provided class', () => {
      expect(TestFacade.mock).toHaveBeenCalledWith(123123)
    })
  })

  describe('#spyOn', () => {
    class TestFacadeImplementation extends Facade {
      hello(number: number) {
        return `${number}`
      }
    }
    const TestFacade = Facade.create(TestFacadeImplementation)
    let spy: jest.SpyInstance

    beforeEach(() => {
      spy = TestFacade.spyOn('hello', jest)
      TestFacade.hello(123123)
    })

    it('returns a valid jest spy', () => {
      expect(spy).toHaveBeenCalledWith(123123)
    })
  })

  describe('#mock', () => {
    class TestFacadeImplementation extends Facade {
      hello(number: number) {
        return `${number}`
      }
    }
    const TestFacade = Facade.create(TestFacadeImplementation)

    beforeEach(() => {
      TestFacade.mock('hello', (num) => num, jest)
      TestFacade.hello(123123)
    })

    it('returns a valid jest spy', () => {
      expect(TestFacade.hello).toHaveBeenCalledWith(123123)
    })
  })
})

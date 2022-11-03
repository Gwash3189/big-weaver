import { Fetch } from '../../src/client/fetch'


describe('Fetch', () => {
  let instance: Fetch<any>
  let pathValidationMock: jest.Mock
  let bodyValidationMock: jest.Mock
  let responseValidationMock: jest.Mock

  beforeEach(() => {
    global.fetch = jest.fn()
    pathValidationMock = jest.fn(() => true)
    bodyValidationMock = jest.fn(() => true)
    responseValidationMock = jest.fn(() => true)
    instance = Fetch.input({
      path: ({ id }) => `a/path/${id}`,
      validation: {
        body: { parse: (_data, _params) => bodyValidationMock() },
        path: { parse: (_data, _params) => pathValidationMock() },
        response: { parse: (_data, _params) => responseValidationMock() },
      }
    })
  })

  describe('#input', () => {
    it('returns a new Fetch instance', () => {
      expect(instance).toBeInstanceOf(Fetch)
    })
  })

  describe('#key', () => {
    it('returns the cache key for the request', () => {
      expect(instance.key({ id: '123' })).toEqual('a/path/123')
    })
  })

  describe.each(['get', 'post', 'put', 'delete'])('%s', (method) => {
    beforeEach(async () => {
      global.fetch = jest.fn(() => Promise.resolve({
        status: 200,
        json: jest.fn(() => Promise.resolve({
          data: {
            user: {
              id: '123'
            }
          }
        }))
      })) as unknown as any
      pathValidationMock = jest.fn((x) => x)
      bodyValidationMock = jest.fn((x) => x)
      responseValidationMock = jest.fn((x) => x)
      instance = Fetch.input({
        path: ({ id }) => `a/path/${id}`,
        validation: {
          body: { parse: (data, _params) => bodyValidationMock(data) },
          path: { parse: (data, _params) => pathValidationMock(data) },
          response: { parse: (data, _params) => responseValidationMock(data) },
        }
      })

      await (instance as any)[method](
        { id: '123' },
        {
          headers: {
            something: 'another'
          }
        }
      )
    })

    it(`sends a ${method} request with fetch`, () => {
      expect(global.fetch).toHaveBeenCalledWith(
        'a/path/123',
        expect.objectContaining({
          method: method.toUpperCase()
        })
      )
    })

    it('includes the provided options', () => {
      expect(global.fetch).toHaveBeenCalledWith(
        'a/path/123',
        expect.objectContaining({
          method: method.toUpperCase(),
          headers: expect.objectContaining({
            something: 'another'
          })
        })
      )
    })

    it('validates the path arguments', () => {
      expect(pathValidationMock).toHaveBeenCalledWith({
        id: '123'
      })
    })

    it('validates the response value', () => {
      expect(responseValidationMock).toHaveBeenCalledWith({
        data: {
          user: {
            id: '123'
          }
        }
      })
    })

    describe('when no validators are provided', () => {
      beforeEach(async () => {
        global.fetch = jest.fn(() => Promise.resolve({
          status: 200,
          json: jest.fn(() => Promise.resolve({
            data: {
              user: {
                id: '123'
              }
            }
          }))
        })) as unknown as any
        pathValidationMock = jest.fn((x) => x)
        bodyValidationMock = jest.fn((x) => x)
        responseValidationMock = jest.fn((x) => x)
        instance = Fetch.input({
          path: ({ id }) => `a/path/${id}`,
        })

        await instance.get(
          { id: '123' }
        )
      })

      it('does not validate the path arguments', () => {
        expect(pathValidationMock).not.toHaveBeenCalled()
      })

      it('does not validate the response value', () => {
        expect(responseValidationMock).not.toHaveBeenCalled()
      })

    })
  })
})

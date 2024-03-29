import * as Helpers from '../src'

describe('Helpers', () => {
  it('works', () => {
    expect(Helpers).toEqual({
      error: expect.any(Function),
      errors: expect.any(Function),
      data: expect.any(Function),
      Controller: expect.any(Function),
      Facade: expect.any(Function),
      Logger: expect.any(Function),
      RequestBuilder: expect.any(Function),
      ResponseBuilder: expect.any(Function),
      del: expect.any(Function),
      get: expect.any(Function),
      getBody: expect.any(Function),
      getPageFromQuery: expect.any(Function),
      getQuery: expect.any(Function),
      head: expect.any(Function),
      install: expect.any(Function),
      options: expect.any(Function),
      patch: expect.any(Function),
      post: expect.any(Function),
      put: expect.any(Function),
      hasMiddlewareInstalled: expect.any(Function),
      willRescueFrom: expect.any(Function)
    })
  })
})

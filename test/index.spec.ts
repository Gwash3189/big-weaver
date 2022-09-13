import * as Helpers from '../src'

describe('Helpers', () => {
  it('works', () => {
    expect(Helpers).toEqual({
      Auth: expect.any(Function),
      BaseRepository: expect.any(Function),
      Controller: expect.any(Function),
      Cookie: expect.any(Function),
    CurrentJWT: expect.anything(),
      Facade: expect.any(Function),
      Logger: expect.any(Function),
      Protected: expect.any(Function),
      Repositorys: expect.anything(),
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
      repository: expect.any(Function)
    })
  })
})

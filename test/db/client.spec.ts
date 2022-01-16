import { Handler, use } from '../../src/db/client'

describe('use', () => {
  class Client {}

  it('passes the provided client to the privided function', () => {
    const result = use(new Client())
    const check = (((client: Client) => {
      expect(client).toBeInstanceOf(Client)
    }) as unknown) as Handler<any>
    result(check)
  })
})

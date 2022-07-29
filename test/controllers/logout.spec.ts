import { NextApiRequest, NextApiResponse } from 'next'
import { Auth } from '../../src/auth'
import { get, RequestBuilder, ResponseType } from '../../src/test'
import { LogoutController as LController } from '../../src/controllers/logout'

describe('when there is a get request', () => {
  class LogoutController extends LController {
    protected async onSuccess(_req: NextApiRequest, _res: NextApiResponse<any>): Promise<any> {
      onSuccessSpy()
    }
  }

  let request: RequestBuilder,
      response: ResponseType,
      onSuccessSpy: jest.Mock

  beforeEach(async () => {
    onSuccessSpy = jest.fn()
    request = new RequestBuilder().cookie(Auth.jwtCookie, 'afakejwt')
    response = await get(LogoutController, request)
  })

  it('removes the JWT', () => {
    expect(response.getHeader('Set-Cookie'))
      .toEqual(
        expect.arrayContaining([
          expect.stringContaining(`${Auth.jwtCookie}=;`)
        ])
      )
  })

  it('calls onSuccess', () => {
    expect(onSuccessSpy).toHaveBeenCalled()
  })
})

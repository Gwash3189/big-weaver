import { NextApiRequest, NextApiResponse } from 'next'
import { Cookie } from '../src'
import { RequestKey, ResponseKey } from '../src/network-jar'
import { NetworkJar } from '../src/network-jar'
import { RequestBuilder, ResponseBuilder } from '../src/test'

describe('Cookie', () => {
  let res: NextApiResponse

  describe('#set', () => {
    beforeEach(() => {
      res = new ResponseBuilder().build()
      NetworkJar.set(ResponseKey, res)
      Cookie.set('name', 123)
    })

    it('sets a cookie on the response', () => {
      expect(ResponseBuilder.as(res).headers['Set-Cookie'])
        .toEqual(['name=123'])
    })

    describe('when there are no existing cookies', () => {
      beforeEach(() => {
        res = new ResponseBuilder().build()
        NetworkJar.set(ResponseKey, res)
        Cookie.set('name', 123)
      })

      it('sets a cookie on the response', () => {
        expect(ResponseBuilder.as(res).headers['Set-Cookie'])
          .toEqual(['name=123'])
      })
    })
  })

  describe('#remove', () => {
    beforeEach(() => {
      Cookie.mock('set', jest.fn())
      Cookie.remove('name')
    })

    afterEach(() => {
      Cookie.reset('set')
    })

    it('Sets an expirery time for the cookie', () => {
      expect(Cookie.set).toHaveBeenCalledWith('name', '', { expires: expect.any(Date)})
    })
  })

  describe('#get', () => {
    let req: NextApiRequest
    beforeEach(() => {
      req = new RequestBuilder().cookie('name', '123').build()
      NetworkJar.set(RequestKey, req)
    })

    it('returns the expected cookie', () => {
      expect(Cookie.get('name')).toContain('123')
    })
  })
})

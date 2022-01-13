import { NextApiRequest } from 'next'
import { getBody, getPageFromQuery, getQuery } from '../../src/request'

describe('getBody', () => {
  it('returns the body of the provided object', () => {
    const req = ({ body: { name: 'name' } } as unknown) as NextApiRequest
    expect(getBody<any>(req)).toEqual(req.body)
  })
})

describe('getQuery', () => {
  it('returns the body of the provided object', () => {
    const req = ({ query: { name: 'name' } } as unknown) as NextApiRequest
    expect(getQuery<any>(req)).toEqual(req.query)
  })
})

describe('getPageFromQuery', () => {
  describe('when the page is a valid page number', () => {
    it('returns the page query parameter from the url', () => {
      const req = ({ query: { page: '2' } } as unknown) as NextApiRequest
      expect(getPageFromQuery(req)).toEqual(2)
    })
  })

  describe('when the page is not a valid page number', () => {
    it('returns the number one', () => {
      const req = ({ query: { name: 'asdasd' } } as unknown) as NextApiRequest
      expect(getPageFromQuery(req)).toEqual(1)
    })
  })
})

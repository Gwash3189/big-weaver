import { NextApiRequest, NextApiResponse } from 'next'
import { Cookie } from '../src'
import { RequestKey, ResponseKey } from '../src/network-jar'
import { NetworkJar } from '../src/network-jar'

describe('Cookie', () => {
  let mockResponse: object, mockSetHeaders: jest.Mock

  describe('#set', () => {
    beforeEach(() => {
      mockSetHeaders = jest.fn()
      mockResponse = {
        getHeader: jest.fn(() => []),
        setHeader: mockSetHeaders,
      }
      NetworkJar.set(ResponseKey, mockResponse as NextApiResponse)
      Cookie.set('name', 123)
    })

    it('sets a cookie on the response', () => {
      expect(mockSetHeaders).toHaveBeenCalledWith('Set-Cookie', ['name=123'])
    })

    describe('when there are no existing cookies', () => {
      beforeEach(() => {
        mockSetHeaders = jest.fn()
        mockResponse = {
          getHeader: jest.fn(),
          setHeader: mockSetHeaders,
        }
        NetworkJar.set(ResponseKey, mockResponse as NextApiResponse)
        Cookie.set('name', 123)
      })

      it('sets a cookie on the response', () => {
        expect(mockSetHeaders).toHaveBeenCalledWith('Set-Cookie', ['name=123'])
      })
    })
  })

  describe('#remove', () => {
    beforeEach(() => {
      mockSetHeaders = jest.fn()
      mockResponse = {
        getHeader: jest.fn(() => []),
        setHeader: mockSetHeaders,
      }
      NetworkJar.set(ResponseKey, mockResponse as NextApiResponse)
      Cookie.remove('name')
    })

    it('Sets an expirery time for the cookie', () => {
      expect(mockSetHeaders.mock.calls[0][1][0]).toContain('Expires')
    })

    it('Sets the cookie value to empty', () => {
      expect(mockSetHeaders.mock.calls[0][1][0]).toContain('name=;')
    })
  })

  describe('#get', () => {
    let mockRequest = {}
    beforeEach(() => {
      mockSetHeaders = jest.fn()
      mockRequest = {
        cookies: {
          name: 123,
        },
      }
      NetworkJar.set(RequestKey, mockRequest as NextApiRequest)
    })

    it('sets a cookie on the response', () => {
      expect(Cookie.get('name')).toEqual(123)
    })
  })
})

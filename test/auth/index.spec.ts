import { Auth, Cookie, Logger } from '../../src'
import * as JWT from 'jsonwebtoken'
import { Hash } from '../../src/hash'

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'signedjwt'),
    verify: jest.fn(() => ({ user: { id: 1 } })),
  }
})

describe('Auth', () => {
  describe('#verify', () => {
    describe('when Auth is not configured', () => {
      beforeEach(async () => {
        Logger.mock('error', jest.fn())
        Cookie.mock(
          'get',
          jest.fn(() => JWT.sign({ user: { id: 1 } }, 'secret'))
        )
      })

      afterEach(() => {
        Cookie.reset('get')
        Logger.reset('error')
      })

      it('throws an error', async () => {
        try {
          await Auth.verify()
        } catch (error) {
          expect(error).toBeTruthy()
        }
      })

      it('logs an error message', async () => {
        try {
          await Auth.verify()
        } catch (error) {
          expect(Logger.error).toHaveBeenCalledWith({ message: 'JWT Secret is not set. Please call Auth.configure to set the secret' })
        }
      })
    })

    describe('when the jwt cookie is not set', () => {
      let result: any

      beforeEach(async () => {
        Auth.configure('secret')
        Cookie.mock(
          'get',
          jest.fn(() => undefined)
        )
        result = await Auth.verify()
      })

      afterEach(() => {
        Cookie.reset('get')
      })

      it('returns false', async () => {
        expect(result).toEqual(false)
      })
    })

    describe('when the jwt cookie is set', () => {
      let result: any

      beforeEach(async () => {
        Auth.configure('secret')
        Cookie.mock(
          'get',
          jest.fn(() => JWT.sign({ user: { id: 1 } }, 'secret'))
        )
        result = await Auth.verify()
      })

      afterEach(() => {
        Cookie.reset('get')
      })

      it('returns the decoded jwt', async () => {
        expect(result).toEqual({ user: { id: 1 } })
      })

      it('gets the jwt cooke', async () => {
        expect(Cookie.get).toHaveBeenCalledWith(Auth.jwtCookie)
      })
    })
  })

  describe('#setJwt', () => {
    beforeEach(() => {
      Auth.configure('secret')
      Cookie.mock('set', jest.fn())
    })

    afterEach(() => {
      Cookie.reset('set')
    })

    it('sets the jwt cookie with a jwt', async () => {
      await Auth.setJwt({ user: { id: 1 } })

      expect(Cookie.set).toHaveBeenCalledWith(Auth.jwtCookie, expect.any(String), { httpOnly: true, domain: '/' })
    })

    describe('when custom options are provided to #set', () => {
      it('passes those options to Cookie.set', async () => {
        await Auth.setJwt({ user: { id: 1 } }, { domain: 'silly/domain.com' })

        expect(Cookie.set).toHaveBeenCalledWith(Auth.jwtCookie, expect.any(String), { httpOnly: true, domain: 'silly/domain.com' })
      })
    })
  })

  describe('#attempt', () => {
    beforeEach(() => {
      Hash.mock(
        'check',
        jest.fn(() => true)
      )
    })

    afterEach(() => {
      Hash.reset('check')
    })

    it('calls the hash service', () => {
      Auth.attempt('password', 'hashedpassword')

      expect(Hash.check).toHaveBeenCalledWith('password', 'hashedpassword')
    })
  })

  describe('#hash', () => {
    beforeEach(() => {
      Hash.mock('make', jest.fn())
    })

    afterEach(() => {
      Hash.reset('make')
    })

    it('calls the hash service', () => {
      Auth.hash('password')

      expect(Hash.make).toHaveBeenCalled()
    })
  })

  describe('#getJwt', () => {
    const jwtToken = { user: 1 }

    describe('when the auth service is not configured', () => {
      it('returns an error', async () => {
        try {
          await Auth.getJwt(jwtToken)
        } catch (error) {
          expect((error as any).message).toContain('JWT Secret is not set. Please call Auth.configure to set the secret')
        }
      })
    })

    describe('when the auth service is configured', () => {
      let result: string

      beforeEach(async () => {
        Auth.configure('secret')
        result = await Auth.getJwt(jwtToken)
      })

      it('returns a jwt', async () => {
        expect(result).toBeTruthy()
      })

      it('returns a jwt that will expire in an hour', async () => {
        expect(JWT.sign).toHaveBeenCalledWith(jwtToken, 'secret', { expiresIn: '1h' })
      })

      it('does not return an error', async () => {
        try {
          await Auth.getJwt(jwtToken)
        } catch (error) {
          expect(error).toBeFalsy()
        }
      })
    })
  })
})

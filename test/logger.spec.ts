import 'reflect-metadata'

import { Logger } from '../src/logger'
import pino from 'pino'

const pinoInternals = {
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn(),
  trace: jest.fn(),
}

jest.mock('pino', () => {
  return jest.fn(() => {
    return pinoInternals
  })
})

describe('Logger', () => {
  describe('#new', () => {
    beforeAll(() => {
      Logger.configure({})
    })

    it('configures "email" to be redacted', () => {
      expect(((pino as unknown) as jest.Mock).mock.calls[0][0]['redact']).toContain('email')
    })

    it('configures "password" to be redacted', () => {
      expect(((pino as unknown) as jest.Mock).mock.calls[0][0]['redact']).toContain('password')
    })

    it('configures "hashedPassword" to be redacted', () => {
      expect(((pino as unknown) as jest.Mock).mock.calls[0][0]['redact']).toContain('hashedPassword')
    })

    it('configures "name" to be redacted', () => {
      expect(((pino as unknown) as jest.Mock).mock.calls[0][0]['redact']).toContain('name')
    })

    it('configures "lastName" to be redacted', () => {
      expect(((pino as unknown) as jest.Mock).mock.calls[0][0]['redact']).toContain('lastName')
    })

    it('configures "firstName" to be redacted', () => {
      expect(((pino as unknown) as jest.Mock).mock.calls[0][0]['redact']).toContain('firstName')
    })
  })

  describe('#configure', () => {
    const options = {}
    beforeEach(() => {
      Logger.configure(options)
    })

    it('creates a new logger with the provided options', () => {
      expect(pino).toHaveBeenLastCalledWith(options)
    })
  })
  ;['debug', 'warn', 'error', 'fatal', 'trace'].forEach(method => {
    describe(`when ${method} is called`, () => {
      it('passes the json object to pino', () => {
        let loggingObject = { message: 'hello world ' }
        ;(Logger as any)[method](loggingObject)
        expect((pinoInternals as any)[method]).toHaveBeenCalledWith(loggingObject)
      })
    })
  })

  describe('#configure', () => {
    const options = {}
    beforeEach(() => {
      Logger.configure(options)
    })

    it('creates a new logger with the provided options', () => {
      expect(pino).toHaveBeenLastCalledWith(options)
    })
  })
})

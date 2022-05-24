/* eslint-disable import/first */
/* eslint-disable prettier/prettier */
const debugMock = jest.fn()
const warnMock = jest.fn()
const errorMock = jest.fn()
const fatalMock = jest.fn()
const traceMock = jest.fn()

const pinoMock = {
  debug: debugMock,
  warn: warnMock,
  error: errorMock,
  fatal: fatalMock,
  trace: traceMock,
}
jest.mock('pino', () => {
  return jest.fn(() => pinoMock)
})

import pino from 'pino'
import { Logger } from '../src/logger'

describe('Logger', () => {
  it('sets the logging level correctly in a test environment', () => {
    expect(((pino as unknown) as jest.Mock).mock.calls[0][0].level).toEqual('silent')
  })

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
        expect((pinoMock as any)[method]).toHaveBeenCalledWith(loggingObject)
      })
    })
  })
})

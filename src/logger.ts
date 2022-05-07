import { Facade } from './facade'
import pino, { Logger as Log, LoggerOptions } from 'pino'

export class LoggingImplementation extends Facade {
  private logger: Log

  constructor() {
    super()

    let value = process.env.LOGGING_LEVEL || (process.env.NODE_ENV === 'production' && 'warn') || (process.env.NODE_ENV === 'test' && 'silent') || 'trace'
    this.logger = pino({
      redact: ['email', 'password', 'hashedPassword', 'name', 'lastName', 'firstName'],
      level: value,
    })
  }

  configure(options: LoggerOptions) {
    this.logger = pino(options)
  }

  debug(params: object) {
    this.logger.debug(params)
  }

  warn(params: object) {
    this.logger.warn(params)
  }

  error(params: object) {
    this.logger.error(params)
  }

  fatal(params: object) {
    this.logger.fatal(params)
  }

  trace(params: object) {
    this.logger.trace(params)
  }
}

export const Logger = Facade.create(LoggingImplementation)

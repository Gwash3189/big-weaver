import { Facade } from './facade'
import pino, { Logger as Log, LoggerOptions } from 'pino'

type MinimalLoggingProps = {
  message: string
}

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

  debug(params: MinimalLoggingProps & { [key: string]: any }) {
    this.logger.debug(params)
  }

  warn(params: MinimalLoggingProps & { [key: string]: any }) {
    this.logger.warn(params)
  }

  error(params: MinimalLoggingProps & { [key: string]: any }) {
    this.logger.error(params)
  }

  fatal(params: MinimalLoggingProps & { [key: string]: any }) {
    this.logger.fatal(params)
  }

  trace(params: MinimalLoggingProps & { [key: string]: any }) {
    this.logger.trace(params)
  }
}

export const Logger = Facade.create(LoggingImplementation)

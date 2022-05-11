import { Facade } from './facade'
import pino, { LoggerOptions } from 'pino'

type MinimalLoggingProps = {
  message: string
} & { [key: string]: any }

const value = process.env.LOGGING_LEVEL || (process.env.NODE_ENV === 'production' && 'warn') || (process.env.NODE_ENV === 'test' && 'silent') || 'trace'
let logger = pino({
  redact: ['email', 'password', 'hashedPassword', 'name', 'lastName', 'firstName'],
  level: value,
})

export class Logger extends Facade {
  static configure(options: LoggerOptions) {
    logger = pino(options)
  }

  static debug(params: MinimalLoggingProps) {
    logger.debug(params)
  }

  static warn(params: MinimalLoggingProps) {
    logger.warn(params)
  }

  static error(params: MinimalLoggingProps) {
    logger.error(params)
  }

  static fatal(params: MinimalLoggingProps) {
    logger.fatal(params)
  }

  static trace(params: MinimalLoggingProps) {
    logger.trace(params)
  }
}

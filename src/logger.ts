import { Facade } from './facade'
import pino, { LoggerOptions } from 'pino'

type MinimalLoggingProps = {
  message: string
} & Record<string, any>

function getLoggingLevel (): string {
  let level = 'warn'

  if (process.env.NODE_ENV === 'production') {
    level = 'warn'
  }

  if (process.env.NODE_ENV === 'test') {
    level = 'silent'
  }

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
    level = 'trace'
  }

  if (process.env.LOGGING_LEVEL !== undefined) {
    level = process.env.LOGGING_LEVEL
  }

  return level
}

let logger = pino({
  redact: ['email', 'password', 'hashedPassword', 'name', 'lastName', 'firstName'],
  level: getLoggingLevel()
})

export class Logger extends Facade {
  static configure (options: LoggerOptions): void {
    logger = pino({
      level: getLoggingLevel(),
      ...options
    })
  }

  static debug (params: MinimalLoggingProps): void {
    logger.debug(params)
  }

  static warn (params: MinimalLoggingProps): void {
    logger.warn(params)
  }

  static error (params: MinimalLoggingProps): void {
    logger.error(params)
  }

  static fatal (params: MinimalLoggingProps): void {
    logger.fatal(params)
  }

  static trace (params: MinimalLoggingProps): void {
    logger.trace(params)
  }
}

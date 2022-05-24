import { Facade } from './facade'
import pino, { LoggerOptions } from 'pino'

type MinimalLoggingProps = {
  message: string
} & Record<string, any>



function getLoggingLevel() {
  let level

  if (process.env.NODE_ENV === 'production') {
    level = 'warn'
  }

  if (process.env.NODE_ENV === 'test') {
    level = 'silent'
  }

  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    level = 'trace'
  }

  if (process.env.LOGGING_LEVEL) {
    level = process.env.LOGGING_LEVEL
  }

  return level
}

let logger = pino({
  redact: ['email', 'password', 'hashedPassword', 'name', 'lastName', 'firstName'],
  level: getLoggingLevel()
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

import { Env } from '@/env'
import { Facade } from '@/facade'
import { Logger } from '@/logger'

export class AuthEnv extends Facade {
  static JWT_KEY_NAME = 'JWT_SECRET'
  static DEVELOPMENT_JWT_KEY = 'secret'

  static jwtSecret (): string {
    if (!Env.exists(AuthEnv.JWT_KEY_NAME)) {
      if (Env.dev() || Env.test()) {
        Logger.debug({ message: 'JWT_VALUE environment varibale is not set. Using development key' })
        return this.DEVELOPMENT_JWT_KEY
      } else {
        throw new Error('JWT_VALUE environment varibale is not set. Not in development environment - not using development secret')
      }
    } else {
      return Env.get(AuthEnv.JWT_KEY_NAME) as string
    }
  }
}

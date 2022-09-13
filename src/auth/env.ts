import { Env } from '@/env'
import { Facade } from '@/facade'
import { Logger } from '@/logger'

export class AuthEnv extends Facade {
  static JWT_KEY_NAME = 'JWT_SECRET'
  static DEVELOPMENT_JWT_KEY = 'secret'

  static jwtSecret() {
    let jwtValue = Env.get(AuthEnv.JWT_KEY_NAME)

    if (!jwtValue) {
      if (Env.dev() || Env.test()) {
        Logger.debug({ message: 'JWT_VALUE environment varibale is not set. Using development key' })
        jwtValue = this.DEVELOPMENT_JWT_KEY
      } else {
        throw new Error('JWT_VALUE environment varibale is not set. Not in development environment - not using development secret')
      }
    }

    return jwtValue
  }
}

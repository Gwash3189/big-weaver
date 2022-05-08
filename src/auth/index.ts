import { Facade } from '../facade'
import { Hash } from '../hash'

class AuthImplementation extends Facade {
  async attempt(password: string, hashedPassword: string) {
    return await Hash.check(password, hashedPassword)
  }

  async hash(password: string) {
    return await Hash.make(password)
  }
}

export const Auth = Facade.create(AuthImplementation)

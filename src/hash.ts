import { Facade } from './facade'
import bcrypt from 'bcrypt'
import { facade } from './container'

@facade()
class HashImplementation {
  private saltRounds = 10

  async make(password: string, options: { rounds: number } = { rounds: this.saltRounds }) {
    return await bcrypt.hash(password, options.rounds)
  }

  async check(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}

export const Hash = Facade.create(HashImplementation)

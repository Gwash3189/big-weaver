import { Facade } from './facade'
import bcrypt from 'bcrypt'

class HashImplementation extends Facade {
  private saltRounds = 10

  async make(password: string, options: { rounds: number } = { rounds: this.saltRounds }) {
    return await bcrypt.hash(password, options.rounds)
  }

  async check(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}

export const Hash = Facade.create(HashImplementation)

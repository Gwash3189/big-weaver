import { Facade } from './facade'
import bcrypt from 'bcryptjs'

const saltRounds = 10

export class Hash extends Facade {
  static async make(password: string, options: { rounds: number } = { rounds: saltRounds }) {
    return await bcrypt.hash(password, options.rounds)
  }

  static async check(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}

import { Repository } from './index'
import { PrismaClient } from '@prisma/client'
import { Facade } from '../../facade'

let prisma: PrismaClient | null

export abstract class BaseRepository<T, X> extends Repository<T, X> {
  getClient(): PrismaClient {
    if (!prisma) {
      prisma = this.createClient()
    }
    return prisma
  }

  static mock(method: string, imple: () => any) {
    Facade.mock(method, imple)
  }

  static reset(...methods: string[]) {
    Facade.reset(...methods)
  }

  abstract createClient(): PrismaClient
}

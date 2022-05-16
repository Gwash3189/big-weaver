import { Repository } from './index'
import { PrismaClient } from '@prisma/client'
import { Facade } from '../../facade'
import { Container } from '../container'

let prisma: PrismaClient | null

export const Repositorys = new Container()

export abstract class BaseRepository<T, X> extends Repository<T, X> {
  abstract createClient(): PrismaClient

  getClient(): PrismaClient {
    if (!prisma) {
      prisma = this.createClient()
    }
    return prisma
  }

  mock(method: string, imple: () => any) {
    Facade.mock.bind(this)(method, imple)
  }

  reset(...methods: string[]) {
    Facade.reset.bind(this)(...methods)
  }
}

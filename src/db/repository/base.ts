import { Repository } from './index'
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient | null

export abstract class BaseRespository<T, X> extends Repository<T, X> {
  getClient(): PrismaClient {
    if (!prisma) {
        prisma = this.createClient()
    }
    return prisma
  }

  abstract createClient(): PrismaClient
}

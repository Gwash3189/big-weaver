import { PrismaClient } from '@prisma/client'
import { Use, use } from '../client'

export abstract class Repository<T, X> {
  protected db: Use
  abstract getDataType(client: PrismaClient): T
  abstract getClient(): PrismaClient

  constructor() {
    this.db = use(this.getClient())
  }

  protected async query(func: (prisma: T) => Promise<X | X[] | null>): Promise<X | X[] | null> {
    return this.db<X>(client => {
      const dataType = this.getDataType(client)
      return func(dataType)
    })
  }

  protected async single(func: (prisma: T) => Promise<X | null>): Promise<X | null> {
    return this.query(func) as Promise<X | null>
  }

  protected async many(func: (prisma: T) => Promise<X[]>): Promise<X[]> {
    return this.query(func) as Promise<X[]>
  }

  public async all(page: number = 1, take: number = 30) {
    const skip = (page - 1) * take
    return await this.many(async item => {
      return await (item as any).findMany({
        skip,
        take,
      })
    })
  }

  public async first() {
    return await this.single(async item => {
      return await (item as any).findFirst()
    })
  }

  async findById(id: string | Number) {
    return await this.single(async item => {
      return await (item as any).findUnique({
        where: {
          id,
        },
      })
    })
  }
}

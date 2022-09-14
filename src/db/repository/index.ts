import { PrismaClient } from '@prisma/client'
import { Use, use } from '@/db/client'

export abstract class Repository<T, X> {
  protected db: Use
  abstract getDataType (client: PrismaClient): T
  abstract getClient (): PrismaClient

  constructor () {
    this.db = use(this.getClient())
  }

  protected async query (func: (prisma: T) => Promise<X | X[] | null>): Promise<X | X[] | null> {
    return await this.db<X>(async client => {
      const dataType = this.getDataType(client)
      return await func(dataType)
    })
  }

  protected async single (func: (prisma: T) => Promise<X | null>): Promise<X | null> {
    return await (this.query(func) as Promise<X | null>)
  }

  protected async many (func: (prisma: T) => Promise<X[]>): Promise<X[]> {
    return await (this.query(func) as Promise<X[]>)
  }

  public async all (page: number = 1, take: number = 30): Promise<X[]> {
    const skip = (page - 1) * take
    return await this.many(async item => {
      // eslint-disable-next-line @typescript-eslint/return-await
      return await (item as any).findMany({
        skip,
        take
      })
    })
  }

  public async first (): Promise<X | null> {
    return await this.single(async item => {
      // eslint-disable-next-line @typescript-eslint/return-await
      return await (item as any).findFirst()
    })
  }

  async findById (id: string | Number): Promise<X | null> {
    return await this.single(async item => {
      // eslint-disable-next-line @typescript-eslint/return-await
      return await (item as any).findUnique({
        where: {
          id
        }
      })
    })
  }
}

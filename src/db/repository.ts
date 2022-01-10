import { PrismaClient } from '.prisma/client'
import { connect } from './connect'

export abstract class Repository<T, X> {
  protected db: typeof connect
  abstract getDataType(client: PrismaClient): T

  constructor(dbClient: typeof connect = connect) {
    this.db = dbClient
  }

  protected async query(func: (prisma: T) => Promise<X | X[] | null>): Promise<X | X[] | null> {
    return this.db<X>(client => {
      const dataType = this.getDataType(client)
      return func(dataType)
    })
  }

  protected async querySingle(func: (prisma: T) => Promise<X | null>): Promise<X | null> {
    return this.query(func) as Promise<X | null>
  }

  protected async queryMany(func: (prisma: T) => Promise<X | X[]>): Promise<X[]> {
    return this.query(func) as Promise<X[]>
  }

  public async all(page: number = 1, take: number = 30) {
    const skip = (page - 1) * take

    return await this.queryMany(async item => {
      return await (item as any).findMany({
        skip,
        take,
      })
    })
  }

  public async first() {
    return await this.querySingle(async item => {
      return await (item as any).findFirst()
    })
  }

  async findById(id: string) {
    return await this.querySingle(async item => {
      return await (item as any).findUnique({
        where: {
          id,
        },
      })
    })
  }
}

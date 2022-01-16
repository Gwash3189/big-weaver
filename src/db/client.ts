import { PrismaClient } from '@prisma/client'

export type Handler<T> = (client: PrismaClient) => Promise<T | T[] | null>
export type Use = <T>(func: Handler<T>) => Promise<T | T[] | null>
export const use = (prisma: PrismaClient) => <T>(func: Handler<T>) => {
  return func(prisma)
}

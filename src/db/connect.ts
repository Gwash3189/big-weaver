import { PrismaClient } from '@prisma/client'
let prisma: PrismaClient | null = null

export function connect<T>(func: (client: PrismaClient) => Promise<T | T[] | null>): Promise<T | T[] | null> {
  if (prisma === null) {
    prisma = new PrismaClient()
  }

  return func(prisma)
}

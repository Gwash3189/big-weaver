import { BaseRepository } from '../../src'

describe('BaseRepository', () => {
  class UserRepository extends BaseRepository<Prisma.UserDelegate<any>, User> {

  }
})

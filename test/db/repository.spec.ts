import { Repository } from '../../src/db/repository'

type DB = {
  data: { users: any }
  findMany: jest.Mock
  findFirst: jest.Mock
  findUnique: jest.Mock
}

describe('Repository', () => {
  let base: BaseRepository
  let db: DB
  let findManyMock: jest.Mock
  let findFirstMock: jest.Mock
  let findUniqueMock: jest.Mock
  class BaseRepository extends Repository<any, any> {
    getDataType(client: any) {
      return client
    }

    getClient(): any {
      return db
    }
  }

  beforeEach(() => {
    findManyMock = jest.fn()
    findFirstMock = jest.fn()
    findUniqueMock = jest.fn()
    db = {
      data: { users: [{ id: 1 }, { id: 2 }] },
      findMany: findManyMock,
      findFirst: findFirstMock,
      findUnique: findUniqueMock,
    }
    base = new BaseRepository()
  })

  describe('all', () => {
    describe('when not given a page and number', () => {
      it('skips zero records and takes the first thirty', async () => {
        await base.all()
        expect(db.findMany).toHaveBeenCalledWith({
          skip: 0,
          take: 30,
        })
      })
    })

    describe('when given a page of one and a take value of one', () => {
      it('skips zero records and takes one', async () => {
        await base.all(1, 1)
        expect(db.findMany).toHaveBeenCalledWith({
          skip: 0,
          take: 1,
        })
      })
    })

    describe('when given a page of nine and a take value of three', () => {
      it('skips zero records and takes one', async () => {
        await base.all(9, 3)
        expect(db.findMany).toHaveBeenCalledWith({
          skip: 24,
          take: 3,
        })
      })
    })
  })

  describe('first', () => {
    it('calls findFirst', async () => {
      await base.first()
      expect(db.findFirst).toHaveBeenCalled()
    })
  })

  describe('findById', () => {
    it('calls findUnique with the provided id', async () => {
      await base.findById(db.data.users[0].id)
      expect(db.findUnique).toHaveBeenCalledWith({ where: { id: db.data.users[0].id } })
    })
  })
})

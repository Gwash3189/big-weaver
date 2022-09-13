jest.mock('bcryptjs', () => {
  return {
    hash: jest.fn(),
    compare: jest.fn()
  }
})

import {Hash} from '../src/hash'
import bcrypt from 'bcryptjs'

describe(Hash, () => {
  describe('#make', () => {
    it('hashes the provided password', () => {
      Hash.make('password')

      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10)
    })

    describe('when options are provided', () => {
      it('hashes the provided password with the provided options', () => {
        Hash.make('password', { rounds: 11 })

        expect(bcrypt.hash).toHaveBeenCalledWith('password', 11)
      })
    })
  })

  describe('#check', () => {
    it('hashes the provided password', () => {
      Hash.check('password', 'hashedpassword')

      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword')
    })
  })
})

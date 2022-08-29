jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'signedjwt'),
    verify: jest.fn(() => ({ user: { id: 1 } })),
  }
})

describe('Auth', () => {
  it.skip('should have tests', () => {})
})

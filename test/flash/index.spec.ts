import { Session } from '../../src/session'
import { Flash } from '../../src/flash'
import { FlashConstants } from '../../src/flash/flash-constants'

describe('Flash', () => {
  describe('#clear', () => {
    beforeEach(() => {
      Session.mock('clear', jest.fn())
      Flash.clear()
    })

    afterEach(() => {
      Session.reset('clear')
    })

    it('clears all flash messages from the session', () => {
      expect(Session.clear).toHaveBeenCalledWith(FlashConstants.error)
      expect(Session.clear).toHaveBeenCalledWith(FlashConstants.info)
      expect(Session.clear).toHaveBeenCalledWith(FlashConstants.success)
      expect(Session.clear).toHaveBeenCalledWith(FlashConstants.warning)
    })
  })

  describe.each(['success', 'error', 'info', 'warning'])('flash messages types', (messageType: string) => {
    describe(`#${messageType}`, () => {
      beforeEach(() => {
        Session.mock('set', jest.fn())
        Session.mock(
          'get',
          jest.fn(() => [])
        )
      })

      afterEach(() => {
        Session.reset('set')
        Session.reset('get')
      })

      it(`sets a ${messageType} flash message in session storage`, () => {
        ;(Flash as any)[messageType](`it was a ${messageType}!`, {
          domain: '/',
        })

        expect(Session.set).toHaveBeenCalledWith(
          expect.any(String),
          [
            {
              message: `it was a ${messageType}!`,
              type: messageType,
            },
          ],
          {
            domain: '/',
            httpOnly: false,
            expires: expect.any(Date),
          }
        )
      })
    })
  })
})

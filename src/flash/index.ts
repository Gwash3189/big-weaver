import Cookies from 'cookies'
import dayjs from 'dayjs'
import { Facade } from '../facade'
import { FlashConstants } from '../flash/flash-constants'
import { Session, SessionValue } from '../session'

export class Flash extends Facade {
  static clear (): void {
    FlashConstants.names.forEach((name) => {
      Session.clear(name)
    })
  }

  static success (message: SessionValue, options: Cookies.SetOption = {}): void {
    const flashes = Session.get(FlashConstants.success, [])

    Session.set(
      FlashConstants.success,
      [
        ...flashes,
        {
          message,
          type: 'success'
        }
      ],
      {
        httpOnly: false,
        expires: dayjs(Date.now()).add(1, 'day').toDate(),
        ...options
      }
    )
  }

  static info (message: SessionValue, options: Cookies.SetOption = {}): void {
    const flashes = Session.get(FlashConstants.info, [])

    Session.set(
      FlashConstants.info,
      [
        ...flashes,
        {
          message,
          type: 'info'
        }
      ],
      {
        httpOnly: false,
        expires: dayjs(Date.now()).add(1, 'day').toDate(),
        ...options
      }
    )
  }

  static warning (message: SessionValue, options: Cookies.SetOption = {}): void {
    const flashes = Session.get(FlashConstants.warning, [])

    Session.set(
      FlashConstants.warning,
      [
        ...flashes,
        {
          message,
          type: 'warning'
        }
      ],
      {
        httpOnly: false,
        expires: dayjs(Date.now()).add(1, 'day').toDate(),
        ...options
      }
    )
  }

  static error (message: SessionValue, options: Cookies.SetOption = {}): void {
    const flashes = Session.get(FlashConstants.error, [])

    Session.set(
      FlashConstants.error,
      [
        ...flashes,
        {
          message,
          type: 'error'
        }
      ],
      {
        httpOnly: false,
        expires: dayjs(Date.now()).add(1, 'day').toDate(),
        ...options
      }
    )
  }
}

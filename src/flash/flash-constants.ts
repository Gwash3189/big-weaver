export const FlashConstants = {
  get success () {
    return 'flash:success'
  },
  get error () {
    return 'flash:error'
  },
  get warning () {
    return 'flash:warning'
  },
  get info () {
    return 'flash:info'
  },
  get names () {
    return [FlashConstants.error, FlashConstants.info, FlashConstants.success, FlashConstants.warning]
  }
}

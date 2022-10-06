class ControllerError extends Error {
  constructor (public message: string) {
    super(message ?? 'Error occured inside of an controller')
  }
}

export class FourTwoTwo extends ControllerError {
  constructor (public value: any) {
    super('Validation of incoming request failed')
    this.value = value
  }
}

import { ZodObject, ZodRawShape } from 'zod'
import { Facade } from '@/facade'

export class RequestSchema<X extends string, T extends ZodRawShape> extends Facade {
  constructor (public url: X, public zod: ZodObject<T>) {
    super()
  }
}

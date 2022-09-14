import { NextApiRequest } from 'next'
import { NetworkJar, RequestKey } from '@/network-jar'
import { RequestSchema } from './request-schema'
import { SafeParseError, SafeParseSuccess } from 'zod'

interface ValidationSuccess extends SafeParseSuccess<{
  [x: string]: any
}> {

}

interface ValidationError extends SafeParseError<{
  [x: string]: any
}> {

}

type ValidationResult = ValidationSuccess | ValidationError

export class Parameters {
  public parameters: Record<string, any>

  constructor (public query: Partial<Record<string, string | string[]>> = {}, public body: Record<string, any> = {}) {
    this.parameters = {
      ...query,
      ...body
    }
  }

  static get (): Parameters {
    const request = NetworkJar.get<NextApiRequest>(RequestKey)
    return new Parameters(request.query, request.body)
  }

  validate (options: RequestSchema<any, any>): ValidationResult {
    const result = options.zod.safeParse(Parameters.get())

    if (result.success) {
      return result
    }

    return result
  }
}

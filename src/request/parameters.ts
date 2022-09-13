import { NextApiRequest } from 'next'
import { NetworkJar, RequestKey } from '@/network-jar'
import { RequestSchema } from './request-schema'

export class Parameters {
  public parameters: Record<string, any>

  constructor(public query: Partial<Record<string, string | string[]>> = {}, public body: Record<string, any> = {}) {
    this.parameters = {
      ...query,
      ...body,
    }
  }

  static get() {
    const request = NetworkJar.get<NextApiRequest>(RequestKey)
    return new Parameters(request.query, request.body)
  }

  validate(options: RequestSchema<any, any>) {
    const result = options.zod.safeParse(Parameters.get())

    if (result.success) {
      return {
        ...result,
        data: result.data,
      }
    }

    return result
  }
}

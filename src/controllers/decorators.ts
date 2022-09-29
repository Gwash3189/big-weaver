import { NetworkJar } from '../network-jar'
import { Parameters } from '../request/parameters'
import { NextApiRequest, NextApiResponse } from 'next'
import { z, ZodRawShape, ZodTypeAny } from 'zod'

export function input (schema: ZodTypeAny) {
  return function inputDecorator (target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value

    const func = async function (request: NextApiRequest, response: NextApiResponse): Promise<void> {
      const result = (target.params as Parameters).validate(schema)
      if (result.success) {
        return original.call(target, request, response)
      } else {
        NetworkJar.response().status(422).json({
          errors: result.error.flatten()
        })
      }
    }

    return {
      ...descriptor,
      value: func.bind(target)
    }
  }
}

export function query(item: ZodRawShape) {
  return input(z.object({ query: z.object(item)}))
}

export function body(item: ZodRawShape) {
  return input(z.object({ query: z.object(item)}))
}

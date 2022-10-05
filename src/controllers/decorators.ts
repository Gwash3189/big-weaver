import { NetworkJar } from '../network-jar'
import { NextApiRequest, NextApiResponse } from 'next'
import { z, ZodObject, ZodRawShape } from 'zod'
import { AppController } from './app-controller'
import { Parameters } from 'src/request/parameters'

export function input<Rte extends ZodRawShape> (schema: ZodObject<Rte, 'strip', any>, accessor: (params: Parameters) => unknown) {
  return function inputDecorator (target: AppController, _propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value

    const func = async function (request: NextApiRequest, response: NextApiResponse): Promise<void> {
      const result = schema.safeParse(accessor(target.params))

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

export function query<Rte extends ZodRawShape>(item: ZodObject<Rte, 'strip', any>) {
  return input(item, (params) => params.query)
}

export function body<Rte extends ZodRawShape>(item: ZodObject<Rte, 'strip', any>) {
  return input(item, (params) => params.body)
}

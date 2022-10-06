import { NetworkJar } from '../network-jar'
import { NextApiRequest, NextApiResponse } from 'next'
import { AppController } from './app-controller'
import { Parameters } from '../request/parameters'
import { Zodish } from './types'

export function input (schema: Zodish, accessor: (params: Parameters) => unknown) {
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

export function query (item: Zodish) {
  return input(item, (params) => params.query())
}

export function body (item: Zodish) {
  return input(item, (params) => params.body())
}

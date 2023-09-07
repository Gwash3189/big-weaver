import { NetworkJar } from '../network-jar'
import { NextApiRequest, NextApiResponse } from 'next'
import { AppController } from './app-controller'
import { Parameters } from '../request/parameters'
import { Zodish } from './types'

interface DecoratorReturn {
  value: (request: NextApiRequest, response: NextApiResponse) => Promise<void>
  configurable?: boolean | undefined
  enumerable?: boolean | undefined
  writable?: boolean | undefined
  get?: () => any
  set?: (v: any) => void
}

type Decorator = (target: AppController, _propertyKey: string, descriptor: PropertyDescriptor) => DecoratorReturn

export function input<Input> (schema: Zodish<Input>, accessor: (params: Parameters) => unknown): Decorator {
  return function inputDecorator (target: AppController, _propertyKey: string, descriptor: PropertyDescriptor): DecoratorReturn {
    const original = descriptor.value

    const func = async function (request: NextApiRequest, response: NextApiResponse): Promise<void> {
      const result = schema.safeParse(accessor(target.params))

      if (result.success) {
        return original.call(target, request, response)
      } else {
        NetworkJar.response().status(422).json({
          errors: result.error?.flatten()
        })
      }
    }

    return {
      ...descriptor,
      value: func.bind(target)
    }
  }
}

export function query<Input> (item: Zodish<Input>): Decorator {
  return input(item, (params) => params.query())
}

export function body<Input> (item: Zodish<Input>): Decorator {
  return input(item, (params) => params.body())
}

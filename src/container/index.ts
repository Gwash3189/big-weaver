import { singleton } from 'tsyringe'
import { constructor } from 'tsyringe/dist/typings/types'


export function repository<T>() {
  return function(target: constructor<T>) {
    singleton()(target)
  }
}

export const ResponseKey = 'response'
export const RequestKey = 'request'

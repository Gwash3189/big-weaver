import { constructor } from '../types'
import { Repositorys } from './repository/base'

export function repository() {
  return function repositoryDecorator(target: constructor<any>) {
    Repositorys.set(target)
  }
}

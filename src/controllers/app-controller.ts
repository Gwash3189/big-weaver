import { Controller } from '@/controller/controller'
import { Parameters } from '@/request/parameters'

export class AppController extends Controller {
  get params() {
    return Parameters.get()
  }
}

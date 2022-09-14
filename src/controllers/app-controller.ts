import { Controller } from '@/controller/controller'
import { Parameters } from '@/request/parameters'

export class AppController extends Controller {
  get params (): Parameters {
    return Parameters.get()
  }
}

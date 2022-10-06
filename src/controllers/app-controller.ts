import { Middleware } from '../controller/types'
import { Logger } from '../logger'
import { Controller } from '../controller/controller'
import { Parameters } from '../request/parameters'
import { FourTwoTwo } from './exeptions'
import { RequestValidationInput } from './types'

export class AppController extends Controller {
  get params (): Parameters {
    return Parameters.get()
  }

  protected ensure (item: RequestValidationInput) {
    const middleware: Middleware = (request, _response, stop) => {
      try {
        if (item.query !== undefined) {
          const results = item.query?.safeParse(request.query)
          if (!results.success) {
            stop()
            throw new FourTwoTwo(results)
          }
        }
        if (item.body !== undefined) {
          const results = item.body?.safeParse(request.query)
          if (!results.success) {
            stop()
            throw new FourTwoTwo(results)
          }
        }
      } catch (error) {
        if (error instanceof FourTwoTwo) {
          Logger.error({
            message: error.message
          })
          Logger.error({
            message: JSON.stringify(error.value)
          })
        }
      }
    }

    return middleware
  }
}

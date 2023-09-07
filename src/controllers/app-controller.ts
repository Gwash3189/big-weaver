import { Middleware } from '../controller/types'
import { Logger } from '../logger'
import { Controller } from '../controller'
import { Parameters } from '../request/parameters'
import { FourTwoTwo } from './exeptions'
import { RequestValidationInput } from './types'

export class AppController extends Controller {
  get params (): Parameters {
    return Parameters.get()
  }

  protected input<Query = Record<string, unknown>, Body = Record<string, unknown>> (item: RequestValidationInput<Query, Body>): Middleware {
    const middleware: Middleware = (request, _response, stop) => {
      try {
        if (item.query !== undefined) {
          const results = item.query.safeParse(request.query)
          if (!results.success) {
            stop()
            throw new FourTwoTwo(results)
          }
        }

        if (item.body !== undefined) {
          const results = item.body.safeParse(request.body)
          if (!results.success) {
            stop()
            throw new FourTwoTwo(results)
          }
        }
      } catch (err) {
        if (err instanceof FourTwoTwo) {
          Logger.error({
            message: err.message
          })
          Logger.error({
            message: JSON.stringify(err.value)
          })

          throw err
        }
      }
    }

    return middleware
  }
}

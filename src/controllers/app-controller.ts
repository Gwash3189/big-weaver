import { Middleware } from '../controller/types'
import { Logger } from '../logger'
import { Controller } from '../controller/controller'
import { Parameters } from '../request/parameters'
import { FourTwoTwo } from './exeptions'
import { RequestValidationInput } from './types'
import { error } from '../request'

export class AppController extends Controller {
  get params (): Parameters {
    return Parameters.get()
  }

  protected ensure<Query = {}, Body = {}> (item: RequestValidationInput<Query, Body>) {
    const middleware: Middleware = (request, response, stop) => {
      try {
        if (item.query !== undefined) {
          const results = item.query?.safeParse(request.query)
          if (!results.success) {
            stop()
            throw new FourTwoTwo(results)
          }
        }
        if (item.body !== undefined) {
          const results = item.body?.safeParse(request.body)
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
          response.status(422).json(error(err.message))
        }
      }
    }

    return middleware
  }
}

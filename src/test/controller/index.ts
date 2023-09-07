import { NextApiRequest, NextApiResponse } from 'next'
import { AfterMiddleware, BeforeMiddleware } from 'src/controller/middleware'
import { Middleware } from 'src/controller/types'
import { constructor } from 'src/types'
import { Controller, install } from '../../controller'
import { SupportedRequestMethods } from '../../controller/execution'
import { Facade } from '../../facade'

export type RequestType = {
  body: Record<string, any>
  method: string
  cookies: Record<string, string>
  headers: Record<string, string>
  query: Record<string, any>
} | Record<string, any>

export class RequestBuilder {
  private request: RequestType

  constructor () {
    this.request = {
      body: {},
      cookies: {},
      query: {},
      headers: {}
    }
  }

  query (json: Record<string, any>): this {
    this.request.query = {
      ...this.request.query,
      ...json
    }

    return this
  }

  body (json: Record<string, any>): this {
    this.request.body = {
      ...this.request.body,
      ...json
    }

    return this
  }

  cookie (name: string, value: string): this {
    this.request.cookies = {
      ...this.request.cookies,
      [name]: value
    }

    return this
  }

  headers (name: string, value: string): this {
    this.request.headers = {
      ...this.request.headers,
      [name]: value
    }

    return this
  }

  method (method: SupportedRequestMethods): this {
    this.request.method = method.toUpperCase()
    return this
  }

  build<T>(): T {
    return this.request as T
  }
}

export type ResponseType = {
  json: Record<string, any>
  statusCode: number
  ended: boolean
  headers: Record<string, any>
  status: (status: number) => any
  getHeader: (name: string) => any
  setHeader: (name: string, value: string) => any
} | Record<string, any>

export class ResponseBuilder extends Facade {
  private response: ResponseType

  constructor () {
    super()
    this.response = {
      getHeader: (name: string): string | undefined => {
        return this.response.headers[name]
      },
      setHeader: (name: string, value: string): ResponseType => {
        this.response.headers[name] = value
        return this.response
      },
      status: (status: number): ResponseType => {
        this.response.statusCode = status
        return this.response
      },
      end: (): void => {
        this.response.ended = true
      },
      headers: {},
      statusCode: 0
    }
  }

  static as (response: any): ResponseType {
    return response as ResponseType
  }

  json (json: Record<string, any>): this {
    this.response.json = json
    return this
  }

  setHeader (name: string, value: string): this {
    this.response.headers[name] = value
    return this
  }

  getHeader (name: string): string | undefined {
    return this.response.headers[name]
  }

  status (status: number): this {
    this.response.status = status
    return this
  }

  end (): void {
    this.response.ended = true
  }

  build<T>(): T {
    return this.response as T
  }
}

async function requestMaker (method: SupportedRequestMethods, controller: typeof Controller, req: RequestBuilder = new RequestBuilder()): Promise<ResponseType> {
  const res = new ResponseBuilder()
  const handler = install(controller)
  req.method(method)
  await handler((req.build()), (res as unknown) as NextApiResponse)
  return await res.build()
}

interface GetMiddlewareReturnType {
  beforeMiddleware: BeforeMiddleware[]
  afterMiddleware: AfterMiddleware[]
}

function getMiddleware (controller: Controller): GetMiddlewareReturnType {
  const afterMiddleware = ((controller as unknown) as { afterMiddleware: AfterMiddleware[] }).afterMiddleware
  const beforeMiddleware = ((controller as unknown) as { beforeMiddleware: BeforeMiddleware[] }).beforeMiddleware

  return {
    beforeMiddleware,
    afterMiddleware
  }
}

export function hasMiddlewareInstalled (controller: Controller, middleware: Middleware): boolean {
  const wares = getMiddleware(controller)
  const beforeMiddleware = wares.beforeMiddleware.findIndex((beforeMiddleware) => {
    return beforeMiddleware.handle === middleware
  })
  const afterMiddleware = wares.afterMiddleware.findIndex((afterMiddleware) => {
    return afterMiddleware.handle === middleware
  })

  return beforeMiddleware >= 0 || afterMiddleware >= 0
}

export function willRescueFrom<E> (controller: Controller, error: constructor<E>, handler?: (error: any, request: NextApiRequest, response: NextApiResponse) => Promise<any>): boolean {
  const rescueMap = ((controller as unknown) as { rescueMap: Record<string, (error: any, request: NextApiRequest, response: NextApiResponse) => Promise<any>> }).rescueMap
  const willRescueFromError = rescueMap[error.name]

  if (handler !== undefined) {
    return willRescueFromError === handler
  } else {
    return Boolean(willRescueFromError)
  }
}

export const get = async (controller: typeof Controller, req: RequestBuilder = new RequestBuilder()): Promise<ResponseType> => {
  return await requestMaker('get', controller, req)
}

export const post = async (controller: typeof Controller, req: RequestBuilder = new RequestBuilder()): Promise<ResponseType> => {
  return await requestMaker('post', controller, req)
}

export const put = async (controller: typeof Controller, req: RequestBuilder = new RequestBuilder()): Promise<ResponseType> => {
  return await requestMaker('put', controller, req)
}

export const del = async (controller: typeof Controller, req: RequestBuilder = new RequestBuilder()): Promise<ResponseType> => {
  return await requestMaker('delete', controller, req)
}

export const options = async (controller: typeof Controller, req: RequestBuilder = new RequestBuilder()): Promise<ResponseType> => {
  return await requestMaker('options', controller, req)
}

export const patch = async (controller: typeof Controller, req: RequestBuilder = new RequestBuilder()): Promise<ResponseType> => {
  return await requestMaker('patch', controller, req)
}

export const head = async (controller: typeof Controller, req: RequestBuilder = new RequestBuilder()): Promise<ResponseType> => {
  return await requestMaker('head', controller, req)
}

import { NextApiRequest, NextApiResponse } from 'next'
import { Controller, install } from '../../controller'
import { SupportedRequestMethods } from '../../controller/execution'
import { Facade } from '../../facade'

export type RequestType =
  | {
      body: Record<string, any>
      method: string,
      cookies: Record<string, string>,
      query: Record<string, any>
    }
  | Record<string, any>

export class RequestBuilder {
  private request: RequestType

  constructor() {
    this.request = {
      body: {},
      cookies: {},
      query: {}
    }
  }

  query(json: Record<string, any>) {
    this.request.query = {
      ...this.request.query,
      ...json
    }

    return this
  }

  body(json: Record<string, any>) {
    this.request.body = {
      ...this.request.body,
      ...json
    }

    return this
  }

  cookie(name: string, value: string) {
    this.request.cookies = {
      ...this.request.cookies,
      [name]: value
    }

    return this
  }

  method(method: SupportedRequestMethods) {
    this.request.method = method.toUpperCase()
    return this
  }

  build<T>() {
    return this.request as T
  }
}

export type ResponseType =
  | {
      json: Record<string, any>
      statusCode: number,
      ended: boolean,
      headers: Record<string, any>,
      status: (status: number) => any,
      getHeader: (name: string) => any,
      setHeader: (name: string, value: string) => any,
    }
  | Record<string, any>

export class ResponseBuilder extends Facade {
  private response: ResponseType

  constructor() {
    super()
    const that = this

    this.response = {
      getHeader(name: string) {
        that.response.headers[name]
        return that.response
      },
      setHeader(name: string, value: string) {
        that.response.headers[name] = value
        return that.response
      },
      status(status: number) {
        that.response.statusCode = status
        return that.response
      },
      end() {
        that.response.ended = true
        return
      },
      headers: {},
      statusCode: 0
    }
  }

  static as(response: any) {
    return response as ResponseType
  }

  json(json: Record<string, any>) {
    this.response.json = json
    return this
  }

  setHeader(name: string, value: string) {
    this.response.headers[name] = value
    return this
  }

  getHeader(name: string) {
    this.response.headers[name]
    return this
  }

  status(status: number) {
    this.response.status = status
    return this
  }

  end() {
    this.response.ended = true
  }

  build<T>() {
    return this.response as T
  }
}

async function requestMaker(method: SupportedRequestMethods, controller: typeof Controller, req: RequestBuilder = new RequestBuilder()): Promise<ResponseType> {
  const res = new ResponseBuilder()
  const handler = install(controller)
  req.method(method)
  await handler((req.build() as unknown) as NextApiRequest, (res as unknown) as NextApiResponse)
  return res.build()
}

export const get = async (controller: typeof Controller, req: RequestBuilder = new RequestBuilder()): Promise<ResponseType> => {
  return requestMaker('get', controller, req)
}

export const post = async (controller: typeof Controller, req: RequestBuilder = new RequestBuilder()): Promise<ResponseType> => {
  return requestMaker('post', controller, req)
}

export const put = async (controller: typeof Controller, req: RequestBuilder = new RequestBuilder()): Promise<ResponseType> => {
  return requestMaker('put', controller, req)
}

export const del = async (controller: typeof Controller, req: RequestBuilder = new RequestBuilder()): Promise<ResponseType> => {
  return requestMaker('delete', controller, req)
}

export const options = async (controller: typeof Controller, req: RequestBuilder = new RequestBuilder()): Promise<ResponseType> => {
  return requestMaker('options', controller, req)
}

export const patch = async (controller: typeof Controller, req: RequestBuilder = new RequestBuilder()): Promise<ResponseType> => {
  return requestMaker('patch', controller, req)
}

export const head = async (controller: typeof Controller, req: RequestBuilder = new RequestBuilder()): Promise<ResponseType> => {
  return requestMaker('head', controller, req)
}

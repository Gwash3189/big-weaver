import { NextApiRequest, NextApiResponse } from 'next'
import { Controller, install } from '../../controller'
import { SupportedRequestMethods } from '../../controller/execution'
import { Facade } from '../../facade'
import { serialize } from 'cookie'

export type RequestType =
  | {
      body: { [key: string]: any }
      method: string,
      cookies: string
    }
  | { [key: string]: any }

export class RequestBuilder {
  private request: RequestType
  private cookies: string

  constructor() {
    this.request = {}
    this.cookies = ''
  }

  body(json: { [key: string]: any }) {
    this.request.body = json
    return this
  }

  cookie(name: string, value: string, options: {}) {
    this.request.cookies = [...((this.cookies.split(';') as Array<string> | undefined) || []), serialize(name, value, options)]
    return this
  }

  method(method: SupportedRequestMethods) {
    this.request.method = method.toUpperCase()
    return this
  }

  build() {
    return this.request
  }
}

export type ResponseType =
  | {
      json: { [key: string]: any }
      status: number
      ended: boolean
    }
  | { [key: string]: any }

export class ResponseBuilder extends Facade {
  private response: ResponseType

  constructor() {
    super()
    this.response = {}
  }

  json(json: { [key: string]: any }) {
    this.response.json = json
    return this
  }

  status(status: number) {
    this.response.status = status
    return this
  }

  end() {
    this.response.ended = true
  }

  build() {
    return this.response
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

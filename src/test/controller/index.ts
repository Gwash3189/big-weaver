import { NextApiRequest, NextApiResponse } from 'next'
import { Controller, install } from '../../controller'
import { SupportedRequestMethods } from '../../controller/execution'
import { Facade } from '../../facade'

export type RequestType =
  | {
      body: { [key: string]: any }
      method: string
    }
  | { [key: string]: any }

export class RequestBuilder {
  private request: RequestType

  constructor() {
    this.request = {}
  }

  body(json: { [key: string]: any }) {
    this.request.body = json
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

export const get = async (controller: typeof Controller, req: RequestBuilder): Promise<ResponseType> => {
  const res = new ResponseBuilder()
  const handler = install(controller)
  req.method('get')
  await handler((req.build() as unknown) as NextApiRequest, (res as unknown) as NextApiResponse)
  return res.build()
}

export const post = async (controller: typeof Controller, req: RequestBuilder): Promise<ResponseType> => {
  const res = new ResponseBuilder()
  const handler = install(controller)
  req.method('post')
  await handler((req.build() as unknown) as NextApiRequest, (res as unknown) as NextApiResponse)
  return res.build()
}

export const put = async (controller: typeof Controller, req: RequestBuilder): Promise<ResponseType> => {
  const res = new ResponseBuilder()
  const handler = install(controller)
  req.method('put')
  await handler((req.build() as unknown) as NextApiRequest, (res as unknown) as NextApiResponse)
  return res.build()
}

export const del = async (controller: typeof Controller, req: RequestBuilder): Promise<ResponseType> => {
  const res = new ResponseBuilder()
  const handler = install(controller)
  req.method('delete')
  await handler((req.build() as unknown) as NextApiRequest, (res as unknown) as NextApiResponse)
  return res.build()
}

export const options = async (controller: typeof Controller, req: RequestBuilder): Promise<ResponseType> => {
  const res = new ResponseBuilder()
  const handler = install(controller)
  req.method('options')
  await handler((req.build() as unknown) as NextApiRequest, (res as unknown) as NextApiResponse)
  return res.build()
}

export const patch = async (controller: typeof Controller, req: RequestBuilder): Promise<ResponseType> => {
  const res = new ResponseBuilder()
  const handler = install(controller)
  req.method('patch')
  await handler((req.build() as unknown) as NextApiRequest, (res as unknown) as NextApiResponse)
  return res.build()
}

export const head = async (controller: typeof Controller, req: RequestBuilder): Promise<ResponseType> => {
  const res = new ResponseBuilder()
  const handler = install(controller)
  req.method('head')
  await handler((req.build() as unknown) as NextApiRequest, (res as unknown) as NextApiResponse)
  return res.build()
}

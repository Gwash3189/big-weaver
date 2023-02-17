import { NextApiRequest } from 'next'

export function getBody<T> (request: NextApiRequest): T {
  return request.body as T
}

export function getQuery<T> (request: NextApiRequest): T {
  return (request.query as unknown) as T
}

export function getPageFromQuery (request: NextApiRequest): number {
  let page = parseInt(getQuery<{ page?: string }>(request).page ?? '1', 10)
  if (isNaN(page) || page <= 0) {
    page = 1
  }

  return page
}

export function data<Input> (input: Input): { data: Input } {
  return {
    data: input
  }
}

type ErrorOutput<T> = ({error: string} | {errors: string[]} & T

export function error<Input, Output> (input: Input): Output {
  return (Array.isArray(input)
    ? {
        errors: input
      }
    : {
        error: input
      }) as ErrorOutput<Output>
}

export function errors (input: any[]) {
  return error(input)
}

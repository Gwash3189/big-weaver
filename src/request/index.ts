import { NextApiRequest } from 'next'

export function getBody<T>(request: NextApiRequest) {
  return request.body as T
}

export function getQuery<T>(request: NextApiRequest) {
  return (request.query as unknown) as T
}

export function getPageFromQuery(request: NextApiRequest) {
  let page = parseInt(getQuery<{ page?: string }>(request).page || '1', 10)
  if (isNaN(page) || page <= 0) {
    page = 1
  }

  return page
}

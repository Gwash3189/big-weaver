import { NextApiRequest } from 'next'

export function getBody<T>(req: NextApiRequest) {
  return req.body as T
}

export function getQuery<T>(req: NextApiRequest) {
  return (req.query as unknown) as T
}

export function getPageFromQuery(req: NextApiRequest) {
  let page = parseInt(getQuery<{ page?: string }>(req).page || '1', 10)
  if (isNaN(page) || page <= 0) {
    page = 1
  }

  return page
}

import { NextApiRequest, NextApiResponse } from 'next'
import { Jar } from './jar'

export const ResponseKey = 'response'
export const RequestKey = 'request'

export const NetworkJar = new Jar<NextApiRequest | NextApiResponse>()

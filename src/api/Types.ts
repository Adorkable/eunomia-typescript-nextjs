import { NextApiRequest, NextApiResponse } from 'next'

export type RequestHandler<T> = (
  request: NextApiRequest,
  response: NextApiResponse<T>
) => Promise<void>

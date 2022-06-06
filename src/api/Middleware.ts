import { NextApiRequest, NextApiResponse } from 'next'

// TODO: should all this middleware be moved to a eunomia-typescript-express?

export type ExpressRequestHandler = (
  request: NextApiRequest,
  response: NextApiResponse,
  next: (result: any) => void
) => void

const promiseMiddleware = (middleware: ExpressRequestHandler) => {
  return async (request: NextApiRequest, response: NextApiResponse) => {
    return new Promise<void>((resolve, reject) => {
      middleware(request, response, (result: any) =>
        result instanceof Error ? reject(result) : resolve(result)
      )
    })
  }
}

export const applyMiddlewares = async (
  middlewares: ExpressRequestHandler[],
  request: NextApiRequest,
  response: NextApiResponse
) => {
  // TODO: optionally support applying sequentially
  await Promise.all(
    middlewares.map((middleware) => {
      const promisedMiddleware = promiseMiddleware(middleware)
      return promisedMiddleware(request, response)
    })
  )
}

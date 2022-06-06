import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
import { NextApiRequest, NextApiResponse } from 'next'
import { applyMiddlewares, ExpressRequestHandler } from './Middleware'
import { RequestHandler } from './Types'
import { getIPFromRequest } from './Utility'

export const createRateLimitMiddlewares = ({
  limit = 10,
  windowMs = 60 * 1000,
  delayAfter = Math.round(10 / 2),
  delayMs = 500
} = {}) =>
  [
    slowDown({ keyGenerator: getIPFromRequest, windowMs, delayAfter, delayMs }),
    rateLimit({ keyGenerator: getIPFromRequest, windowMs, max: limit })
  ] as unknown as RequestHandler<any>[]

export const DefaultRateLimitMiddlewares = createRateLimitMiddlewares()

export const createMiddlewaresWithRateLimit = ({
  limit = 10,
  windowMs = 60 * 1000,
  delayAfter = Math.round(10 / 2),
  delayMs = 500
} = {}) =>
  createRateLimitMiddlewares({
    limit,
    windowMs,
    delayAfter,
    delayMs
  })

export type RateLimitResponseOptions = {
  statusCode?: number
  response?: any
}

export const RateLimitResponseOptionsDefaults: RateLimitResponseOptions = {
  statusCode: 429,
  response: 'Too many requests, please try again later.'
}

type ApplyRateLimitMiddlesAndOptionallyContinueOptions<T> = {
  rateLimitMiddlewares?: ExpressRequestHandler[]
  continueWith: RequestHandler<T>
  options: RateLimitResponseOptions
}

export const applyRateLimitMiddlesAndOptionallyContinue = <T>({
  rateLimitMiddlewares = DefaultRateLimitMiddlewares,
  continueWith,
  options = RateLimitResponseOptionsDefaults
}: ApplyRateLimitMiddlesAndOptionallyContinueOptions<T>): RequestHandler<T> => {
  return async (request: NextApiRequest, response: NextApiResponse) => {
    try {
      await applyMiddlewares(rateLimitMiddlewares, request, response)
    } catch {
      return response
        .status(
          options.statusCode ||
            RateLimitResponseOptionsDefaults.statusCode ||
            429
        )
        .send(
          options.response ||
            RateLimitResponseOptionsDefaults.response ||
            'Too many requests, please try again later.'
        )
    }

    return continueWith(request, response)
  }
}

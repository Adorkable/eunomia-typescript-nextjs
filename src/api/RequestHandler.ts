import { NextApiRequest, NextApiResponse } from 'next'
import {
  respondWithError,
  respondWithSuccess,
  ResponseFailureStatusCode,
  ResponseSuccessStatusCode
} from './Respond'
import { requestWithJsonResponse } from './Request'

import { sleep } from '@adorkable/eunomia-typescript/lib/Async'
import { RequestHandler } from './Types'

export type MockOptions = {
  enabled?: boolean
  requestHandler: RequestHandler<any>
  delayMilliseconds?: number
}

const realResponseFactory =
  <T>(realRequestHandler: RequestHandler<T>) =>
  async (request: NextApiRequest, response: NextApiResponse) => {
    response.setHeader('Content-Type', 'application/json')

    return realRequestHandler(request, response)
  }

const mockResponseFactory =
  (options: MockOptions) =>
  async (request: NextApiRequest, response: NextApiResponse) => {
    response.setHeader('Content-Type', 'application/json')
    if (
      typeof options.delayMilliseconds === 'number' &&
      options.delayMilliseconds > 0
    ) {
      await sleep(options.delayMilliseconds / 1000)
    }

    return options.requestHandler(request, response)
  }

export const requestHandlerWithJsonResponseAndMockFactory = <T>(
  realRequestHandler: RequestHandler<T>,
  mockOptions: MockOptions
): RequestHandler<T> => {
  if (mockOptions.enabled) {
    return mockResponseFactory(mockOptions)
  } else {
    return realResponseFactory(realRequestHandler)
  }
}

export type SimpleMockOptions<T> = {
  enabled?: boolean
  delayMilliseconds?: number
  responseBody: T
}

export const simpleRequestHandlerWithJsonResponseAndMockFactory = <T>(
  url: string,
  mockOptions: SimpleMockOptions<T>,
  successStatusCode: number = ResponseSuccessStatusCode,
  failureStatusCode: number = ResponseFailureStatusCode
): RequestHandler<T> => {
  return requestHandlerWithJsonResponseAndMockFactory(
    async (_, response) => {
      return requestWithJsonResponse<T>(url)
        .then((responseBody) => {
          return respondWithSuccess(response, responseBody, successStatusCode)
        })
        .catch((error) => {
          return respondWithError(response, error, failureStatusCode)
        })
    },
    {
      enabled: mockOptions.enabled,
      requestHandler: async (_, response) => {
        return response.status(successStatusCode).json(mockOptions.responseBody)
      },
      delayMilliseconds: mockOptions.delayMilliseconds
    }
  )
}

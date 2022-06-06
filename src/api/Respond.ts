import { NextApiResponse } from 'next'

export const ResponseSuccessStatusCode = 200

export const respondWithSuccess = <T>(
  response: NextApiResponse,
  responseBody: T,
  statusCode: number = ResponseSuccessStatusCode
) => {
  return response.status(statusCode).json(responseBody)
}

export const ResponseFailureStatusCode = 501

export const respondWithError = (
  res: NextApiResponse,
  error: Error,
  statusCode: number = ResponseFailureStatusCode
) => {
  res.statusCode = statusCode
  const resultBody = {
    error: error.toString()
  }
  return res.json(resultBody)
}

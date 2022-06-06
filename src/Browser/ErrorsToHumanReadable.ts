import {
  FallbackError,
  ThrottledError,
  UnableToReachError
} from './FetchErrors'

export const fetchErrorToHumanReadableError = (
  unknownError: unknown
): Error => {
  if (unknownError instanceof Error) {
    var error = unknownError as Error

    switch (error.message) {
      case 'Failed to fetch':
        throw new UnableToReachError()

      default:
        console.warn(
          `Unexpected fetch error received: ${error.name} ${error.message} ${error.stack}`
        )
    }
  } else {
    console.warn(`Unexpected fetch error received: ${unknownError}`)
  }

  throw new FallbackError()
}

export const responseToHumanReadableErrorThrowing = (response: Response) => {
  throwOnBadStatusCode(response.status)

  if (response.status > 250) {
    console.warn(`Unexpected status code received: ${response.status}`)

    throw new FallbackError()
  }
}

const parseJsonBodyErrorThrowing = (body: any) => {
  if (typeof body.error === 'string') {
    if (typeof body.message === 'string') {
      const error = new Error(body.message)
      error.name = body.error
      throw error
    }

    throw new Error(body.error)
  }

  if (typeof body.error === 'object') {
    var name: string | undefined
    var message: string | undefined

    if (typeof body.error.name === 'string') {
      name = body.error.name
    }
    if (typeof body.error.message === 'string') {
      message = body.error.message
    }

    if (!message && typeof body.error.error === 'string') {
      message = body.error.error
    }
    const error = new Error(message)
    if (name) {
      error.name = name
    }
    throw error
  }
}

export const responseWithJsonBodyToHumanReadableErrorThrowing = (body: any) => {
  if (body.error) {
    parseJsonBodyErrorThrowing(body)

    console.warn(`Unexpected error value received: ${body.error}`)

    throw new FallbackError()
  } else if (body.statusCode && body.message) {
    // NestJS HttpExceptions
    throwOnBadStatusCode(body.statusCode)

    console.warn(
      `Unexpected NestJS HttpException received: ${body.statusCode} ${body.message}`
    )
    throw new FallbackError()
  }
}

const throwOnBadStatusCode = (statusCode: number) => {
  switch (statusCode) {
    case 429:
      throw new ThrottledError()
  }
}

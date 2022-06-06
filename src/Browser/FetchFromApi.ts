import {
  fetchErrorToHumanReadableError,
  responseToHumanReadableErrorThrowing,
  responseWithJsonBodyToHumanReadableErrorThrowing
} from './ErrorsToHumanReadable'

export type FetchMethod = (
  input: RequestInfo,
  init?: RequestInit | undefined
) => Promise<Response>

export const FetchMethodDefault = fetch

export type FetchFromApiOptions = {
  throwOnErrorResponse?: boolean
  fetchMethod?: FetchMethod
}

const FetchFromApiOptionsDefault: FetchFromApiOptions = {
  throwOnErrorResponse: true,
  fetchMethod: FetchMethodDefault
}

export const fetchFromApi = async (
  url: string,
  method: string,
  options?: FetchFromApiOptions
): Promise<Response> => {
  const fetchMethod =
    options?.fetchMethod ||
    FetchFromApiOptionsDefault.fetchMethod ||
    FetchMethodDefault

  let response: Response
  try {
    response = await fetchMethod(url, {
      method
    })
  } catch (error) {
    throw fetchErrorToHumanReadableError(error)
  }

  const throwOnErrorResponse =
    options?.throwOnErrorResponse ||
    FetchFromApiOptionsDefault.throwOnErrorResponse ||
    true

  if (throwOnErrorResponse) {
    responseToHumanReadableErrorThrowing(response)
  }

  return response
}

export type FetchJsonBodyFromApiOptions = {
  fetchMethod?: FetchMethod
  humanReadableErrorThrowing?: (body: any) => void
}

const FetchJsonBodyFromApiOptionsDefault: FetchJsonBodyFromApiOptions = {
  fetchMethod: FetchMethodDefault,
  humanReadableErrorThrowing: responseWithJsonBodyToHumanReadableErrorThrowing
}

export const fetchJsonBodyFromApi = async <T>(
  url: string,
  method: string,
  options?: FetchJsonBodyFromApiOptions
): Promise<T> => {
  const fetchMethod =
    options?.fetchMethod ||
    FetchJsonBodyFromApiOptionsDefault.fetchMethod ||
    FetchMethodDefault

  const response = await fetchFromApi(url, method, {
    throwOnErrorResponse: false,
    fetchMethod
  })

  const body = await response.json()

  const humanReadableErrorThrowing =
    options?.humanReadableErrorThrowing ||
    FetchJsonBodyFromApiOptionsDefault.humanReadableErrorThrowing ||
    responseWithJsonBodyToHumanReadableErrorThrowing

  humanReadableErrorThrowing(body)

  return body as T
}

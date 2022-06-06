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

export const fetchFromApi = async (
  url: string,
  method: string,
  throwOnErrorResponse: boolean = true,
  fetchMethod: FetchMethod = FetchMethodDefault
): Promise<Response> => {
  let response: Response
  try {
    response = await fetchMethod(url, {
      method
    })
  } catch (error) {
    throw fetchErrorToHumanReadableError(error)
  }

  if (throwOnErrorResponse) {
    responseToHumanReadableErrorThrowing(response)
  }

  return response
}

export const fetchJsonBodyFromApi = async <T>(
  url: string,
  method: string,
  fetchMethod: FetchMethod = FetchMethodDefault
): Promise<T> => {
  const response = await fetchFromApi(url, method, false, fetchMethod)

  const body = await response.json()

  responseWithJsonBodyToHumanReadableErrorThrowing(body)

  return body as T
}

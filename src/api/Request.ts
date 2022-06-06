export type FetchMethod = (
  input: RequestInfo,
  init?: RequestInit | undefined
) => Promise<Response>

export const FetchMethodDefault = fetch

export const requestWithJsonResponse = async <T>(
  url: string,
  method: string = 'POST',
  fetchMethod: FetchMethod = FetchMethodDefault
): Promise<T> => {
  const response = await fetchMethod(url, { method })
  const body = await response.json()
  return body as T
}

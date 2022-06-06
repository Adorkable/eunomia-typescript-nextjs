// TODO: should we catch onSuccess throws? Is that clear from the signature that we do?
// TODO: why are we doing this instead of try/catch?
/**
 *
 * @param requestMethod Request method, returns a Promise
 * @param onSuccess callback called on success
 * @param onError callback called on an error including errors thrown from onSuccess method
 */
export const pageSuccessAndErrorFlow = async <R>(
  requestMethod: () => Promise<R>,
  onSuccess: (response: R) => void,
  onError: (error: Error) => void
) => {
  try {
    const response = await requestMethod()
    onSuccess(response)
  } catch (error) {
    onError(error as Error)
  }
}

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

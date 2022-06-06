export const UnableToReachErrorMessage =
  'We were unable to communicate with the service.\nPlease make sure you are online,\nrefresh the page and try again!'

export class UnableToReachError extends Error {
  constructor() {
    super(UnableToReachErrorMessage)
  }
}

export const FallbackErrorMessage =
  'We were unable to communicate with the artwork.\nPlease make sure you are online,\nrefresh the page and try again!'

export class FallbackError extends Error {
  constructor() {
    super(FallbackErrorMessage)
  }
}

export const ThrottledErrorMessage =
  'You have made too many requests.\nPlease wait a few minutes and try again.'

export class ThrottledError extends Error {
  constructor() {
    super(ThrottledErrorMessage)
  }
}

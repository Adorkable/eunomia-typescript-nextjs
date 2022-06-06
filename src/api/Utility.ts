import { getClientIp } from 'request-ip'
import { Request } from 'express'

export const getIPFromRequest = (request: Request): string => {
  const result = getClientIp(request)
  if (typeof result === 'string') {
    return result
  }
  throw new Error('Unable to retrieve IP')
}

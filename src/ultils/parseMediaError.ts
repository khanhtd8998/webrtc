import type { MediaDeviceErrorType } from '../types/media'

export const parseMediaError = (e: any): MediaDeviceErrorType => {
  if (!e || !e.name) return 'unknown'

  switch (e.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'permission-denied'

    case 'NotReadableError':
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'not-found'

    //   return 'device-busy'

    default:
      return 'unknown'
  }
}

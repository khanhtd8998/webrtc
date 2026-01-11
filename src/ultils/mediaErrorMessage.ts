import type { MediaDeviceErrorType } from '../types/media'

export const mediaErrorMessage: Record<MediaDeviceErrorType, string> = {
  'permission-denied': 'Permission denied',
  'not-found': 'No device found',
  'device-busy': 'Device is being used in another tab',
  unknown: 'Something went wrong'
}

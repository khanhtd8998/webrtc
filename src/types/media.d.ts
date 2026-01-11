export interface MediaSettingState {
  displayName?: string
  microphoneId?: string
  cameraId?: string
  speakerId?: string
}

export type MediaDeviceError = {
  audio?: MediaDeviceErrorType
  video?: MediaDeviceErrorType
}

export type MediaStoreState = {
  devices: MediaSettingState
  errors: MediaDeviceError
  remoteDisplayName: string | undefined
  setRemoteDisplayName: (name: string) => void
  setDevices: (devices: Partial<MediaSettingState>) => void
  setErrors: (updater: Partial<MediaDeviceError> | ((prev: MediaDeviceError) => MediaDeviceError)) => void
  resetSettings: () => void
}

export type MediaStreamState = {
  stream: MediaStream | null
  videoTrack: MediaStreamTrack | null
  audioTrack: MediaStreamTrack | null
  isVideoEnabled: boolean
  isAudioEnabled: boolean

  setVideoTrack: (track: MediaStreamTrack) => void
  setAudioTrack: (track: MediaStreamTrack) => void

  toggleVideo: (enabled: boolean) => void
  toggleAudio: (enabled: boolean) => void

  clear: () => void
}

export type MediaDeviceErrorType = 'permission-denied' | 'not-found' | 'device-busy' | 'unknown'

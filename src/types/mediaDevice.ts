import type { MediaSettingState } from './setting'

export type MediaDeviceError = {
  audio?: string
  video?: string
}

export type MediaStoreState = {
  devices: MediaSettingState
  errors: MediaDeviceError
  setDevices: (devices: Partial<MediaSettingState>) => void
  setErrors: (errors: MediaDeviceError) => void
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

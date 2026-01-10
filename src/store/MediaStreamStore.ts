// store/MediaStreamStore.ts
import { create } from 'zustand'

export interface MediaStreamState {
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

export const useMediaStreamStore = create<MediaStreamState>((set, get) => ({
  stream: new MediaStream(),
  videoTrack: null,
  audioTrack: null,

  isVideoEnabled: true,
  isAudioEnabled: true,

  setVideoTrack: (track) => {
    const stream = get().stream!
    const oldTrack = get().videoTrack
    if (oldTrack) {
      stream.removeTrack(oldTrack)
      oldTrack.stop()
    }
    stream.addTrack(track)
    set({ videoTrack: track })
  },

  setAudioTrack: (track) => {
    const stream = get().stream!
    get().audioTrack?.stop()
    if (get().audioTrack) stream.removeTrack(get().audioTrack!)
    stream.addTrack(track)
    set({ audioTrack: track })
  },

  toggleVideo: (enabled) => {
    const track = get().videoTrack
    if (track) track.enabled = enabled
    set({ isVideoEnabled: enabled })
  },

  toggleAudio: (enabled) => {
    const track = get().audioTrack
    if (track) track.enabled = enabled
    set({ isAudioEnabled: enabled })
  },

  clear: () => {
    get()
      .stream?.getTracks()
      .forEach((t) => t.stop())
    set({
      stream: new MediaStream(),
      videoTrack: null,
      audioTrack: null
    })
  }
}))

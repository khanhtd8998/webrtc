// store/MediaStreamStore.ts
import { create } from 'zustand'
import type { MediaStreamState } from '../types/mediaDevice'

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

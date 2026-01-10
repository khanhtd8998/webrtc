// store/MediaStreamStore.ts
import { create } from 'zustand'

interface MediaStreamState {
  stream: MediaStream | null
  videoTrack: MediaStreamTrack | null
  audioTrack: MediaStreamTrack | null

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

  setVideoTrack: (track) => {
    const stream = get().stream!
    get().videoTrack?.stop()
    if (get().videoTrack) stream.removeTrack(get().videoTrack!)
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
    get().videoTrack && (get().videoTrack!.enabled = enabled)
  },

  toggleAudio: (enabled) => {
    get().audioTrack && (get().audioTrack!.enabled = enabled)
  },

  clear: () => {
    get().stream?.getTracks().forEach((t) => t.stop())
    set({
      stream: new MediaStream(),
      videoTrack: null,
      audioTrack: null,
    })
  },
}))

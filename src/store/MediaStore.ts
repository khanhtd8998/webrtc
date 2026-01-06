import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface MediaDeviceSelection {
  microphoneId?: string
  cameraId?: string
  speakerId?: string
}

interface MediaState {
  username?: string
  devices: MediaDeviceSelection

  setUsername: (username: string) => void
  setDevice: (type: keyof MediaState['devices'], id: string) => void
  reset: () => void
}

export const useMediaStore = create<MediaState>()(
  persist(
    (set) => ({
      username: undefined,
      devices: {},

      setUsername: (username) => set({ username }),

      setDevice: (type, id) =>
        set((state) => ({
          devices: {
            ...state.devices,
            [type]: id
          }
        })),

      reset: () => set({ username: undefined, devices: {} })
    }),
    {
      name: 'media-settings'
    }
  )
)

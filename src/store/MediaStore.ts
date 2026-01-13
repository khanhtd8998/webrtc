import { create } from 'zustand'
import type { MediaStoreState } from '../types/media'

export const useMediaStore = create<MediaStoreState>((set) => ({
  devices: {
    videoEnabled: true,
    audioEnabled: true
  },
  errors: {},
  remoteDisplayName: undefined,
  setDevices: (devices) =>
    set((state) => ({
      devices: {
        ...state.devices,
        ...devices
      }
    })),
  setRemoteDisplayName(name) {
    set({ remoteDisplayName: name })
  },
  setErrors: (updater) =>
    set((state) => ({
      errors: typeof updater === 'function' ? updater(state.errors) : { ...state.errors, ...updater }
    })),
  resetSettings: () => set({ devices: {} })
}))

import { create } from 'zustand'
import type { MediaStoreState } from '../types/mediaDevice'

export const useMediaStore = create<MediaStoreState>((set) => ({
  devices: {},
  errors: {},
  setDevices: (devices) =>
    set((state) => ({
      devices: {
        ...state.devices,
        ...devices
      }
    })),
  setErrors: (errors) => set({ errors }),
  resetSettings: () => set({ devices: {} })
}))

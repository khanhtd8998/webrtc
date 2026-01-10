import { create } from 'zustand'
import type { MediaSettingState } from '../types/setting'
import type { MediaDeviceError } from '../types/mediaDevice'

interface MediaStoreState {
  devices: MediaSettingState
  errors: MediaDeviceError
  setDevices: (devices: Partial<MediaSettingState>) => void
  setErrors: (errors: MediaDeviceError) => void
  resetSettings: () => void
}

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

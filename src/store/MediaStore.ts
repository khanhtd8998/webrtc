import { create } from 'zustand'
import type { MediaSettingState } from '../types/setting'

interface MediaStoreState {
  devices: MediaSettingState
  setDevices: (devices: Partial<MediaSettingState>) => void
  resetSettings: () => void
}

export const useMediaStore = create<MediaStoreState>((set) => ({
  devices: {},
  setDevices: (devices) =>
    set((state) => ({
      devices: {
        ...state.devices,
        ...devices
      }
    })),
  resetSettings: () => set({ devices: {} })
}))

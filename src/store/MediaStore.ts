import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MediaSettingState {
  username?: string
  microphoneId?: string
  cameraId?: string
  speakerId?: string
}

interface MediaStoreState {
  devices: MediaSettingState
  setDevices: (type: keyof MediaSettingState, id: string) => void
  resetSettings: () => void
}


export const useMediaStore = create<MediaStoreState>((set) => ({
  devices: {},
  setDevices: (type, id) => set((state) => ({ devices: { ...state.devices, [type]: id } })),
  resetSettings: () => set({ devices: {} })
}))

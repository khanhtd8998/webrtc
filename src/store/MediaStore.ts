import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MediaSettingState {
  microphone?: string
  camera?: string
  speaker?: string
}

interface MediaStoreState {
  username: string
  devicesSetting: MediaSettingState
  setDevices: (type: keyof MediaSettingState, id: string) => void
  setUsername: (username: string) => void
  resetSettings: () => void
}
// export const useMediaStore = create<MediaStoreState>()(
//   persist(
//     (set) => ({
//       username: '',
//       devicesSetting: {},
//       setUsername: (username) => set({ username }),
//       setDevices: (type, id) => set((state) => ({ devicesSetting: { ...state.devicesSetting, [type]: id } })),
//       resetSettings: () => set({ username: '', devicesSetting: {} })
//     }),
//     {
//       name: 'media-store'
//     }
//   )
// )

export const useMediaStore = create<MediaStoreState>((set) => ({
  username: '',
  devicesSetting: {},
  setUsername: (username) => set({ username }),
  setDevices: (type, id) => set((state) => ({ devicesSetting: { ...state.devicesSetting, [type]: id } })),
  resetSettings: () => set({ username: '', devicesSetting: {} })
}))

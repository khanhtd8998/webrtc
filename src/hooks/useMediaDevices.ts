// hooks/useMediaDevices.ts
import { useEffect, useState } from 'react'

export const useMediaDevices = () => {
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([])
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([])
  const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([])

  useEffect(() => {
    initDevices()
  }, [])

  const initDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()

    setMicrophones(devices.filter((d) => d.kind === 'audioinput'))
    setCameras(devices.filter((d) => d.kind === 'videoinput'))
    setSpeakers(devices.filter((d) => d.kind === 'audiooutput'))
  }

  return {
    microphones,
    cameras,
    speakers
  }
}

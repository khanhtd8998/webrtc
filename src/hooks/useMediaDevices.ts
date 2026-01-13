// hooks/useMediaDevices.ts
import { useEffect, useState } from 'react'
import { useMediaStore } from '../store/MediaStore'
import type { MediaDeviceError } from '../types/media'
import { parseMediaError } from '../ultils/parseMediaError'

export const useMediaDevices = () => {
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([])
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([])
  const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const setErrors = useMediaStore((s) => s.setErrors)
  const setDevices = useMediaStore((s) => s.setDevices)

  useEffect(() => {
    initDevices()
  }, [])

  const initDevices = async () => {
    setIsLoading(true)
    const nextErrors: MediaDeviceError = {}

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      })
      audioStream.getTracks().forEach((t) => t.stop())
    } catch (e) {
      console.warn('Microphone error', e)
      setErrors({ audio: parseMediaError(e) })
    }

    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
      })
      videoStream.getTracks().forEach((t) => t.stop())
    } catch (e: any) {
      console.warn('Camera erroe', e)
      setErrors({ video: parseMediaError(e) })
    }

    const devices = await navigator.mediaDevices.enumerateDevices()
    const microphones = devices.filter((d) => d.kind === 'audioinput')
    const cameras = devices.filter((d) => d.kind === 'videoinput')
    const speakers = devices.filter((d) => d.kind === 'audiooutput')

    setDevices({
      microphoneId: microphones[0]?.deviceId,
      cameraId: cameras[0]?.deviceId,
      speakerId: speakers[0]?.deviceId
    })

    setMicrophones(microphones)
    setCameras(cameras)
    setSpeakers(speakers)

    setIsLoading(false)
    setErrors(nextErrors)
  }

  return {
    microphones,
    cameras,
    speakers,
    isLoading
  }
}

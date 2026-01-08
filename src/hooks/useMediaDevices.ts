// hooks/useMediaDevices.ts
import { useRef, useState, type RefObject } from 'react'
import { useMediaStore } from '../store/MediaStore'
import { useMediaInit } from './useMediaInit'

export const useMediaDevices = (localCameraRef: RefObject<HTMLVideoElement | null>) => {
  const resetSettings = useMediaStore((state) => state.resetSettings)

  const [isLoading, setIsLoading] = useState(true)
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([])
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([])
  const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([])

  const currentStreamRef = useRef<MediaStream | null>(null)

  useMediaInit(localCameraRef, currentStreamRef, setMicrophones, setCameras, setSpeakers, setIsLoading)

  // useEffect(() => {
  //   const changeCamera = async () => {
  //     try {
  //       currentStreamRef.current?.getTracks().forEach((t) => t.stop())

  //       const newStream = await navigator.mediaDevices.getUserMedia({
  //         video: { deviceId: { exact: devices.cameraId } },
  //         audio: { deviceId: { exact: devices.microphoneId } }
  //       })

  //       currentStreamRef.current = newStream
  //       if (localCameraRef.current) localCameraRef.current.srcObject = newStream
  //     } catch (error) {}
  //   }

  //   changeCamera()
  // }, [devices.cameraId])

  // useEffect(() => {
  //   if (!devices.microphoneId) return

  //   const changeMicrophone = async () => {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       audio: { deviceId: { exact: devices.microphoneId } },
  //       video: false
  //     })

  //     const audioTrack = stream.getAudioTracks()[0]

  //     const currentStream = currentStreamRef.current
  //     if (!currentStream) return

  //     currentStream.getAudioTracks().forEach((t) => {
  //       currentStream.removeTrack(t)
  //       t.stop()
  //     })

  //     currentStream.addTrack(audioTrack)
  //   }

  //   changeMicrophone()
  // }, [devices.microphoneId])

  // useEffect(() => {
  //   if (!devices.speakerId) return

  //   const video = localCameraRef.current
  //   if (video && 'setSinkId' in video) {
  //     video.setSinkId(devices.speakerId).catch(console.error)
  //   }
  // }, [devices.speakerId])

  return {
    microphones,
    cameras,
    speakers,
    isLoading,
    resetSettings
  }
}

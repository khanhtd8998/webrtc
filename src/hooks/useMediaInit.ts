// hooks/media/useMediaInit.ts
import { useEffect } from 'react'
import { useMediaStore } from '../store/MediaStore'

export const useMediaInit = (
  localCameraRef: React.RefObject<HTMLVideoElement | null>,
  currentStreamRef: React.RefObject<MediaStream | null>,
  setMicrophones: (d: MediaDeviceInfo[]) => void,
  setCameras: (d: MediaDeviceInfo[]) => void,
  setSpeakers: (d: MediaDeviceInfo[]) => void,
  setIsLoading: (v: boolean) => void
) => {
  const setDevices = useMediaStore((s) => s.setDevices)
  const devices = useMediaStore((s) => s.devices)

  useEffect(() => {
    const initDevices = async () => {
      setIsLoading(true)
      try {
        const initialStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })

        const deviceList = await navigator.mediaDevices.enumerateDevices()
        const mics = deviceList.filter((d) => d.kind === 'audioinput')
        const cams = deviceList.filter((d) => d.kind === 'videoinput')
        const outs = deviceList.filter((d) => d.kind === 'audiooutput')

        setMicrophones(mics)
        setCameras(cams)
        setSpeakers(outs)

        if (!devices.microphoneId && mics[0]) setDevices('microphoneId', mics[0].deviceId)
        if (!devices.cameraId && cams[0]) setDevices('cameraId', cams[0].deviceId)
        if (!devices.speakerId && outs[0]) setDevices('speakerId', outs[0].deviceId)



        initialStream.getTracks().forEach((track) => track.stop())
      } catch (error) {
        console.error('Error initializing devices:', error)
      } finally {
        setIsLoading(false)
      }
    }
    initDevices()
  }, [])

  useEffect(() => {
    const updateStream = async () => {
      if (!devices.cameraId || !devices.microphoneId) return

      if (currentStreamRef.current) {
        currentStreamRef.current.getTracks().forEach((track) => track.stop())
      }

      try {
        const constraints = {
          audio: { deviceId: { exact: devices.microphoneId } },
          video: { deviceId: { exact: devices.cameraId } }
        }

        const newStream = await navigator.mediaDevices.getUserMedia(constraints)
        currentStreamRef.current = newStream

        if (localCameraRef.current) {
          localCameraRef.current.srcObject = newStream
        }
      } catch (error) {
        console.error('Error switching media device:', error)
      }
    }

    updateStream()
  }, [devices.cameraId])

  useEffect(() => {
    if (!devices.microphoneId) return

    const changeMicrophone = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: devices.microphoneId } },
        video: false
      })

      const audioTrack = stream.getAudioTracks()[0]

      const currentStream = currentStreamRef.current
      if (!currentStream) return

      currentStream.getAudioTracks().forEach((t) => {
        currentStream.removeTrack(t)
        t.stop()
      })

      currentStream.addTrack(audioTrack)
    }

    changeMicrophone()
  }, [devices.microphoneId])
}

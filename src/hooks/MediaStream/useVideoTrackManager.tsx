// hooks/useVideoTrackManager.ts
import { useEffect } from 'react'
import { useMediaStore } from '../../store/MediaStore'
import { useMediaStreamStore } from '../../store/MediaStreamStore'

export const useVideoTrackManager = () => {
  const cameraId = useMediaStore((s) => s.devices.cameraId)
  const { videoTrack, setVideoTrack } = useMediaStreamStore()

  useEffect(() => {
    if (!cameraId) return

    const run = async () => {
      try {
        // ✅ STOP TRACK CŨ TRƯỚC
        if (videoTrack) {
          videoTrack.stop()
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: cameraId } },
          audio: false,
        })

        const newTrack = stream.getVideoTracks()[0]
        setVideoTrack(newTrack)
      } catch (err) {
        console.error('Failed to switch camera:', err)
      }
    }

    run()
  }, [cameraId])
}

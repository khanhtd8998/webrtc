import { useEffect } from 'react'
import { useMediaStore } from '../../store/MediaStore'
import { useMediaStreamStore } from '../../store/MediaStreamStore'
import { useMediaDevices } from '../useMediaDevices'

export const useVideoTrackManager = () => {
  const cameraId = useMediaStore((s) => s.devices.cameraId)
  const { videoTrack, setVideoTrack, isVideoEnabled } = useMediaStreamStore()

  useEffect(() => {
    if (!cameraId) return

    // nếu đúng device → bỏ qua
    if (videoTrack?.getSettings().deviceId === cameraId) return

    let cancelled = false

    const run = async () => {
      // 1️⃣ cleanup track cũ
      if (videoTrack) {
        videoTrack.stop()
      }

      // 2️⃣ cho browser thời gian release camera
      await new Promise((r) => setTimeout(r, 150))

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: cameraId } },
          audio: false
        })

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }

        const newTrack = stream.getVideoTracks()[0]
        newTrack.enabled = isVideoEnabled

        setVideoTrack(newTrack)
      } catch (e) {
        console.error('Switch camera failed:', e)
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [cameraId])
}

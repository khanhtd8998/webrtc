import { useEffect } from 'react'
import { useMediaStore } from '../../store/MediaStore'
import { useMediaStreamStore } from '../../store/MediaStreamStore'
import { useMediaDevices } from '../useMediaDevices'
import { parseMediaError } from '../../ultils/parseMediaError'

export const useVideoTrackManager = () => {
  const cameraId = useMediaStore((s) => s.devices.cameraId)
  const setErrors = useMediaStore((s) => s.setErrors)
  const { videoTrack, setVideoTrack, isVideoEnabled } = useMediaStreamStore()

  useEffect(() => {
    if (!cameraId) return

    // nếu đúng device → bỏ qua
    if (videoTrack?.getSettings().deviceId === cameraId) return

    let cancelled = false

    const run = async () => {
      // cleanup track cũ
      if (videoTrack) {
        const stream = useMediaStreamStore.getState().stream
        stream?.removeTrack(videoTrack)
        videoTrack.stop()
      }

      // cho browser thời gian release camera
      await new Promise((r) => setTimeout(r, 300))

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
        setErrors({ video: undefined })
      } catch (e: any) {
        console.error('Switch camera failed:', e)
        setErrors((prev) => ({
          ...prev,
          video: parseMediaError(e)
        }))
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [cameraId])
}

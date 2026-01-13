// hooks/media/useLocalPreview.ts
import { useEffect, useRef, useState } from 'react'
import { useMediaStore } from '../store/MediaStore'
import { parseMediaError } from '../ultils/parseMediaError'

export const useLocalPreview = () => {
  const streamRef = useRef<MediaStream>(new MediaStream())
  const videoRef = useRef<HTMLVideoElement | null>(null)
  
  const cameraId = useMediaStore((s) => s.devices.cameraId)
  const micId = useMediaStore((s) => s.devices.microphoneId)
  const speakerId = useMediaStore((s) => s.devices.speakerId)

  const videoEnabled = useMediaStore((s) => s.devices.videoEnabled ?? true)
  const audioEnabled = useMediaStore((s) => s.devices.audioEnabled ?? true)

  const [videoLoading, setVideoLoading] = useState(false)

  const setErrors = useMediaStore((s) => s.setErrors)
  const setDevices = useMediaStore((s) => s.setDevices)

  /** attach stream */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [])

  /** switch camera */
  useEffect(() => {
    if (!cameraId) return
    let cancelled = false

    const run = async () => {
      setVideoLoading(true)
      try {
        streamRef.current.getVideoTracks().forEach((t) => {
          streamRef.current.removeTrack(t)
          t.stop()
        })

        await new Promise((r) => setTimeout(r, 250))

        const s = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: cameraId } },
          audio: false
        })

        if (cancelled) {
          s.getTracks().forEach((t) => t.stop())
          return
        }

        const track = s.getVideoTracks()[0]
        track.enabled = videoEnabled
        streamRef.current.addTrack(track)

        setErrors({ video: undefined })
      } catch (e: any) {
        setErrors((prev: any) => ({
          ...prev,
          video: parseMediaError(e)
        }))
      } finally {
        setVideoLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [cameraId])

  /** switch mic */
  useEffect(() => {
    if (!micId) return
    let cancelled = false

    const run = async () => {
      try {
        streamRef.current.getAudioTracks().forEach((t) => {
          streamRef.current.removeTrack(t)
          t.stop()
        })

        const s = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: micId } },
          video: false
        })

        if (cancelled) {
          s.getTracks().forEach((t) => t.stop())
          return
        }

        const track = s.getAudioTracks()[0]
        track.enabled = audioEnabled
        streamRef.current.addTrack(track)

        setErrors({ audio: undefined })
      } catch (e: any) {
        setErrors((prev: any) => ({
          ...prev,
          audio: parseMediaError(e)
        }))
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [micId])

  /** switch loa */
  useEffect(() => {
    if (!speakerId || !videoRef.current) return

    const el = videoRef.current as HTMLVideoElement & {
      setSinkId?: (id: string) => Promise<void>
    }

    if (!el.setSinkId) return

    let cancelled = false

    const run = async () => {
      try {
        await el.setSinkId(speakerId)
        if (!cancelled) {
          setErrors({ speaker: undefined })
        }
      } catch (e: any) {
        setErrors((prev: any) => ({
          ...prev,
          speaker: parseMediaError(e)
        }))
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [speakerId])

  useEffect(() => {
    if (!videoRef.current) return

    videoRef.current.srcObject = streamRef.current

    // 👇 apply lại speaker NGAY SAU KHI attach
    if (speakerId && videoRef.current.setSinkId) {
      videoRef.current.setSinkId(speakerId).catch(() => {})
    }
  }, [videoRef.current])

  /** toggle cam */
  const toggleVideo = () => {
    setDevices({ videoEnabled: !videoEnabled })
    streamRef.current.getVideoTracks().forEach((t) => {
      t.enabled = !videoEnabled
    })
  }

  /** toggle mic */
  const toggleAudio = () => {
    setDevices({ audioEnabled: !audioEnabled })
    streamRef.current.getAudioTracks().forEach((t) => {
      t.enabled = !audioEnabled
    })
  }

  /** cleanup */
  useEffect(() => {
    return () => {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = new MediaStream()
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      //   setDevices({ videoEnabled: true, audioEnabled: true })
    }
  }, [])

  return {
    videoRef,
    videoLoading,
    videoEnabled,
    audioEnabled,
    toggleVideo,
    toggleAudio
  }
}

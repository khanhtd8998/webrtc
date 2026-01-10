// hooks/useSpeakerManager.ts
import { useEffect } from 'react'
import { useMediaStore } from '../../store/MediaStore'

export const useSpeakerManager = (videoRef: React.RefObject<HTMLVideoElement | null>) => {
  const speakerId = useMediaStore((s) => s.devices.speakerId)

  useEffect(() => {
    if (!speakerId || !videoRef.current) return
    if ('setSinkId' in videoRef.current) {
      videoRef.current.setSinkId(speakerId)
    }
  }, [speakerId])
}

import { useEffect, useRef } from 'react'
import { useMediaStreamStore } from '../store/MediaStreamStore'
import { useVideoTrackManager } from '../hooks/MediaStream/useVideoTrackManager'
import { useAudioTrackManager } from '../hooks/MediaStream/useAudioTrackManager'
import { useSpeakerManager } from '../hooks/MediaStream/useSpeakerManager'

export const VideoPreview = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const stream = useMediaStreamStore((s) => s.stream)

  useVideoTrackManager()
  useAudioTrackManager()
  useSpeakerManager(videoRef)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return <video ref={videoRef} autoPlay muted playsInline className='w-full h-120 bg-black rounded-md object-cover' />
}

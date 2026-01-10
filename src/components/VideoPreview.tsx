import { useEffect, useRef } from 'react'
import { useMediaStreamStore } from '../store/MediaStreamStore'
import { useVideoTrackManager } from '../hooks/MediaStream/useVideoTrackManager'
import { useAudioTrackManager } from '../hooks/MediaStream/useAudioTrackManager'
import { useSpeakerManager } from '../hooks/MediaStream/useSpeakerManager'
import { useMediaDevices } from '../hooks/useMediaDevices'
import { CircleAlert } from 'lucide-react'
import { useMediaStore } from '../store/MediaStore'

export const VideoPreview = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const stream = useMediaStreamStore((s) => s.stream)
  const errors = useMediaStore((s) => s.errors)
  const setErrors = useMediaStore((s) => s.setErrors)

  useVideoTrackManager()
  useAudioTrackManager()
  useSpeakerManager(videoRef)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }

    return () => {
      setErrors({})
    }
  }, [stream])

  return (
    <>
      <div className='relative w-full h-120 rounded-md overflow-hidden bg-black'>
        <video ref={videoRef} autoPlay muted playsInline className='w-full h-full object-cover' />

        {errors?.video && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/60'>
            <CircleAlert className='text-white' />
            <p className='text-white text-sm text-center px-2'> {errors.video}</p>
          </div>
        )}
      </div>
    </>
  )
}

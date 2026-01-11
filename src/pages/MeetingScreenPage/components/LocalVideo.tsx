import { useEffect, useRef } from 'react'
import { useMediaStreamStore } from '../../../store/MediaStreamStore'
import { useMediaStore } from '../../../store/MediaStore'
import { useVideoTrackManager } from '../../../hooks/MediaStream/useVideoTrackManager'
import { useAudioTrackManager } from '../../../hooks/MediaStream/useAudioTrackManager'
import { useSpeakerManager } from '../../../hooks/MediaStream/useSpeakerManager'
import { CircleAlert } from 'lucide-react'
import { mediaErrorMessage } from '../../../ultils/mediaErrorMessage'

export const LocalVideo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const stream = useMediaStreamStore((s) => s.stream)
  const errors = useMediaStore((s) => s.errors)
  const setErrors = useMediaStore((s) => s.setErrors)
  const errorType = errors.video
  const displayName = useMediaStore((s) => s.devices.displayName)

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
        {displayName && (
          <div className='absolute left-2 bottom-2 bg-black/60 text-white text-sm px-2 py-1 rounded'>{displayName}</div>
        )}

        {errorType && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/60'>
            <CircleAlert className='text-white' />
            <p className='text-white text-sm text-center px-2'>{mediaErrorMessage[errorType]}</p>
          </div>
        )}
      </div>
    </>
  )
}

import { Spin } from 'antd'
import { CircleAlert, Loader } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useMediaStore } from '../../../store/MediaStore'
import { mediaErrorMessage } from '../../../ultils/mediaErrorMessage'
import ToggleMediaSection from '../../PreCallPage/components/ToggleMediaSection'
import { useLocalPreview } from '../../../hooks/useLocalPreview'

export const LocalVideo = ({
  isShowAction = true,
  onUpdateVideoStream,
  onUpdateAudioStream
}: {
  isShowAction?: boolean
  onUpdateVideoStream: () => void
  onUpdateAudioStream: () => void
}) => {
  const errors = useMediaStore((s) => s.errors)
  const errorType = errors.video

  const videoRef = useRef<HTMLVideoElement | null>(null)

  const { stream, videoEnabled, audioEnabled, toggleVideo, toggleAudio } = useLocalPreview()

  // 🎥 attach local stream
  useEffect(() => {
    if (!videoRef.current || !stream) return

    videoRef.current.srcObject = stream
    videoRef.current.muted = true

    videoRef.current.play().catch(() => {
      /* autoplay blocked */
    })
  }, [stream])

  return (
    <div>
      <div className='relative w-full h-120 rounded-md overflow-hidden bg-black'>
        <video ref={videoRef} autoPlay playsInline muted className='w-full h-full object-cover' />

        {errorType && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/60'>
            <CircleAlert className='text-white' />
            <p className='text-white text-sm text-center px-2'>{mediaErrorMessage[errorType]}</p>
          </div>
        )}

        {/* {videoLoading && (
          <div className='absolute inset-0 flex items-center z-50 justify-center bg-black'>
            <Spin className='animate-spin' indicator={<Loader color='white' />} />
          </div>
        )} */}
      </div>

      {isShowAction !== false && (
        <div className='mt-4 flex gap-4 justify-center items-center w-full'>
          <ToggleMediaSection
            videoEnabled={videoEnabled}
            audioEnabled={audioEnabled}
            toggleVideo={() => {
              toggleVideo()
              onUpdateVideoStream()
            }}
            toggleAudio={() => {
              toggleAudio()
              onUpdateAudioStream()
            }}
            errors={errors}
          />
        </div>
      )}
    </div>
  )
}

import { CircleAlert } from 'lucide-react'
import { useMediaStore } from '../../../store/MediaStore'
import { useLocalPreview } from '../../../hooks/useLocalPreview'
import { mediaErrorMessage } from '../../../ultils/mediaErrorMessage'
import ToggleMediaSection from '../../PreCallPage/components/ToggleMediaSection'
export const LocalVideo = ({
  videoRef,
  isShowAction = true
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>
  isShowAction?: boolean
}) => {
  const errors = useMediaStore((s) => s.errors)
  const errorType = errors.video
  const { videoEnabled, audioEnabled, toggleVideo, toggleAudio } = useLocalPreview(videoRef)

  return (
    <div>
      <div className='relative w-full h-120 rounded-md overflow-hidden bg-black'>
        <video ref={videoRef} autoPlay muted playsInline className='w-full h-full object-cover' />

        {errorType && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/60'>
            <CircleAlert className='text-white' />
            <p className='text-white text-sm text-center px-2'>{mediaErrorMessage[errorType]}</p>
          </div>
        )}
      </div>
      {isShowAction !== false && (
        <div className='mt-4 flex gap-4 justify-center items-center w-full'>
          <ToggleMediaSection
            videoEnabled={videoEnabled}
            audioEnabled={audioEnabled}
            toggleVideo={toggleVideo}
            toggleAudio={toggleAudio}
            errors={errors}
          />
        </div>
      )}
    </div>
  )
}

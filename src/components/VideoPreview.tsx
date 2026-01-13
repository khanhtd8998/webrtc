import { CircleAlert, Loader } from 'lucide-react'
import { useLocalPreview } from '../hooks/useLocalPreview'
import ToggleMediaSection from '../pages/PreCallPage/components/ToggleMediaSection'
import { useMediaStore } from '../store/MediaStore'
import { mediaErrorMessage } from '../ultils/mediaErrorMessage'
import { Spin } from 'antd'

export const VideoPreview = ({ isShowAction = true }: { isShowAction?: boolean }) => {
  const errors = useMediaStore((s) => s.errors)
  const errorType = errors.video
  const { videoRef, videoLoading, videoEnabled, audioEnabled, toggleVideo, toggleAudio } = useLocalPreview()

  return (
    <>
      <div className='relative w-full h-120 rounded-md overflow-hidden bg-black'>
        <video ref={videoRef} autoPlay muted playsInline className='w-full h-full object-cover' />

        {errorType && (
          <div className='absolute inset-0 flex items-center z-10 justify-center bg-black/60'>
            <CircleAlert className='text-white' />
            <p className='text-white text-sm text-center px-2'>{mediaErrorMessage[errorType]}</p>
          </div>
        )}
        {videoLoading && (
          <div className='absolute inset-0 flex items-center z-50 justify-center bg-black'>
            <Spin className='animate-spin' indicator={<Loader color='blue' />} />
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
    </>
  )
}

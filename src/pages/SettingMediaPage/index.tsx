// pages/SettingMediaPage.tsx
import { use, useEffect, useRef } from 'react'
import { LoadingOverlay } from '../../components/LoadingOverlay'
import { VideoPreview } from '../../components/VideoPreview'
import { useMediaDevices } from '../../hooks/useMediaDevices'
import { MediaSettingsForm } from './components/MediaSettingsForm'
import { useMediaStore } from '../../store/MediaStore'

const SettingMediaPage = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const { microphones, cameras, speakers, isLoading } = useMediaDevices()

  if (isLoading) {
    return <LoadingOverlay />
  }

  return (
    <>
      <div className='max-w-3xl mx-auto'>
        <div className='p-4'>
          <MediaSettingsForm microphones={microphones} cameras={cameras} speakers={speakers} />
          <div className='mt-4'>
            <VideoPreview videoRef={videoRef} isShowAction={false} />
            <div className='flex justify-center mt-4 gap-4'></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingMediaPage

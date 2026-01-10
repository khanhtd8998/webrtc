// pages/SettingMediaPage.tsx
import { useEffect } from 'react'
import { VideoPreview } from '../../components/VideoPreview'
import { useMediaDevices } from '../../hooks/useMediaDevices'
import { useMediaStore } from '../../store/MediaStore'
import { MediaSettingsForm } from './components/MediaSettingsForm'
import ToggleMediaSection from '../PreCallPage/components/ToggleMediaSection'
import { LoadingOverlay } from '../../components/LoadingOverlay'
import { useMediaStreamStore } from '../../store/MediaStreamStore'

const SettingMediaPage = () => {
  const { microphones, cameras, speakers, isLoading } = useMediaDevices()
  const setDevices = useMediaStore((s) => s.setDevices)

  useEffect(() => {
    setDevices({
      microphoneId: microphones[0]?.deviceId,
      cameraId: cameras[0]?.deviceId,
      speakerId: speakers[0]?.deviceId
    })
  }, [microphones, cameras, speakers])

  if (isLoading) {
    return <LoadingOverlay />
  }

  return (
    <>
      <div className='max-w-3xl mx-auto'>
        <div className='p-4'>
          <MediaSettingsForm microphones={microphones} cameras={cameras} speakers={speakers} />
          <div className='mt-4'>
            <VideoPreview />
            <div className='flex justify-center mt-4 gap-4'>
              <ToggleMediaSection />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingMediaPage

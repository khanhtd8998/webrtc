// pages/SettingMediaPage.tsx
import { useEffect } from 'react'
import { VideoPreview } from '../../components/VideoPreview'
import { useMediaDevices } from '../../hooks/useMediaDevices'
import { useMediaStore } from '../../store/MediaStore'
import { MediaSettingsForm } from './components/MediaSettingsForm'

const SettingMediaPage = () => {
  const { microphones, cameras, speakers } = useMediaDevices()
  const setDevices = useMediaStore((s) => s.setDevices)
  useEffect(() => {
    setDevices({
      microphoneId: microphones[0]?.deviceId,
      cameraId: cameras[0]?.deviceId,
      speakerId: speakers[0]?.deviceId
    })
  }, [microphones, cameras, speakers])


  return (
    <>
      <div className='max-w-4xl mx-auto'>
        <div className='mt-16'>
          <MediaSettingsForm microphones={microphones} cameras={cameras} speakers={speakers} />
          <div className='mt-6'>
            <VideoPreview />
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingMediaPage

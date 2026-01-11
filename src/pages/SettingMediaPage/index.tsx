// pages/SettingMediaPage.tsx
import { useEffect } from 'react'
import { VideoPreview } from '../../components/VideoPreview'
import { useMediaDevices } from '../../hooks/useMediaDevices'
import { useMediaStore } from '../../store/MediaStore'
import { MediaSettingsForm } from './components/MediaSettingsForm'
import ToggleMediaSection from '../PreCallPage/components/ToggleMediaSection'
import { LoadingOverlay } from '../../components/LoadingOverlay'
import { useMediaStreamStore } from '../../store/MediaStreamStore'
import { useNavigationType } from 'react-router'

const SettingMediaPage = () => {
  const { microphones, cameras, speakers, isLoading } = useMediaDevices()
  const navType = useNavigationType()
  const setDevices = useMediaStore((s) => s.setDevices)
  const clear = useMediaStreamStore((s) => s.clear)

  useEffect(() => {
    setDevices({
      microphoneId: microphones[0]?.deviceId,
      cameraId: cameras[0]?.deviceId,
      speakerId: speakers[0]?.deviceId
    })
  }, [microphones, cameras, speakers])

  useEffect(() => {
    if (navType === 'POP') {
      clear()
    }
  }, [navType])

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

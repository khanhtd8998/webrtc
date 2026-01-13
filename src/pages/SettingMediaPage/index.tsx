// pages/SettingMediaPage.tsx
import { LoadingOverlay } from '../../components/LoadingOverlay'
import { VideoPreview } from '../../components/VideoPreview'
import { useMediaDevices } from '../../hooks/useMediaDevices'
import { MediaSettingsForm } from './components/MediaSettingsForm'

const SettingMediaPage = () => {
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
            <VideoPreview isShowAction={false} />
            <div className='flex justify-center mt-4 gap-4'></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingMediaPage

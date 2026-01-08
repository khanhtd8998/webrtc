import { Button, Form, Input, Spin } from 'antd'
import { Mic, Video } from 'lucide-react'
import { useRef, useState } from 'react'
import { useMediaStore } from '../../store/MediaStore'
import { MediaPreview } from '../SettingMediaPage/components/MediaPreview'
import { useMediaDevices } from '../../hooks/useMediaDevices'

const HomeMediaPage = () => {
  const [loading, setLoading] = useState(true)
  const localCameraRef = useRef<HTMLVideoElement>(null)

  const devicesSetting = useMediaStore((s) => s.devices)

  useMediaDevices(localCameraRef)
  return (
    <>
      <div className='max-w-4xl mx-auto p-4'>
        <h1 className='font-semibold'>Hi, {devicesSetting?.username}</h1>
        <div className='mt-16 flex items-center gap-4'>
          <Input id='link-meeting' placeholder='Enter link Meeting' />
          <Button type='primary'>Join</Button>
          <Button type='primary'>Create Meeting</Button>
        </div>
        <div className='mt-16'>
          <MediaPreview
            videoRef={localCameraRef}
          />
          <div className='flex justify-center mt-4 gap-4'>
            <Button shape='circle' size='large'>
              <Mic />
            </Button>
            {devicesSetting?.cameraId && (
              <Button shape='circle' size='large'>
                <Video />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default HomeMediaPage

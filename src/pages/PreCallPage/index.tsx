import { Button, Input } from 'antd'
import { Mic } from 'lucide-react'
import { VideoPreview } from '../../components/VideoPreview'
import { useMediaStore } from '../../store/MediaStore'
import { useEffect } from 'react'

const HomeMediaPage = () => {
  const devices = useMediaStore((state) => state.devices)
  useEffect(() => {
    console.log('devices changed in precall:', devices)
  }, [devices])
  return (
    <>
      <div className='max-w-4xl mx-auto p-4'>
        <div className='mt-16 flex items-center gap-4'>
          <Input id='link-meeting' placeholder='Enter link Meeting' />
          <Button type='primary'>Join</Button>
          <Button type='primary'>Create Meeting</Button>
        </div>
        <div className='mt-4'>
          <VideoPreview />
        </div>
        <div className='mt-16'>
          <div className='flex justify-center mt-4 gap-4'>
            <Button shape='circle' size='large'>
              <Mic />
            </Button>
            {/* {devicesSetting?.cameraId && (
              <Button shape='circle' size='large'>
                <Video />
              </Button>
            )} */}
          </div>
        </div>
      </div>
    </>
  )
}

export default HomeMediaPage

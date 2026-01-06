import { Button, Input } from 'antd'
import { Mic, Video } from 'lucide-react'

const HomeMediaPage = () => {
  return (
    <>
      <div className='max-w-4xl mx-auto p-4'>
        <h1 className='font-semibold'>Web RTC</h1>
        <div className='mt-16 flex items-center gap-4'>
          <Input id='link-meeting' placeholder='Enter link Meeting' />
          <Button type='primary'>Join</Button>
          <Button type='primary'>Create Meeting</Button>
        </div>
        <div className='mt-16'>
          <video className='w-full h-150 rounded-md bg-[#ccc]' autoPlay playsInline></video>
          <div className='flex justify-center mt-4 gap-4'>
            <Button shape='circle' size='large'>
              <Mic />
            </Button>
            <Button shape='circle' size='large'>
              <Video />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomeMediaPage

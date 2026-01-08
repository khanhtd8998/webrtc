import { Button, Input } from 'antd'
import { SendHorizontal } from 'lucide-react'

type Props = {}

const MeetingScreenPage = (props: Props) => {
  return (
    <>
      <div className='p-4'>
        <div className='flex justify-between items-center'>
          <h1 className='font-semibold'>Web RTC</h1>
          <Button color='danger' variant='solid' style={{ width: '120px' }}>
            Leave
          </Button>
        </div>

        <div className='mt-16 grid grid-cols-3 gap-4 h-150'>
          <video className='w-full h-full rounded-md bg-[#ccc]' autoPlay playsInline></video>
          <video className='w-full h-full rounded-md bg-[#ccc]' autoPlay playsInline></video>
          <div className='border border-[#ccc] rounded-md p-2 h-full'>
            <div className='rounded-2xl h-150 overflow-y-auto'>
              {Array.from({ length: 40 }).map((_, i) => (
                <p key={i} className='p-2'>
                  Chat messages will appear here
                </p>
              ))}
            </div>
            <div className='flex gap-4 mt-3'>
              <Input id='link-meeting' placeholder='Enter link Meeting' />
              <Button shape='circle' size='large'>
                <SendHorizontal />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MeetingScreenPage

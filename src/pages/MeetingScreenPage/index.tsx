import { Button, Input } from 'antd'
import { SendHorizontal } from 'lucide-react'
import { usePeerConnection } from '../../hooks/usePeerConnection'
import { LocalVideo } from './components/LocalVideo'
import { RemoteVideo } from './components/RemoteVideo'
import { useMeetingActions } from '../../hooks/useMeetingActions'
import { useMediaStore } from '../../store/MediaStore'
import { useEffect } from 'react'
import { socket } from '../../configs/socket'

const MeetingScreenPage = () => {
  const roomId = sessionStorage.getItem('meeting-room')
  const isHost = sessionStorage.getItem('meeting-role') === 'host'
  const localDisplayName = useMediaStore((s) => s.devices.displayName)
  const { remoteStream } = usePeerConnection(roomId!, isHost)
  useEffect(() => {
    if (localDisplayName && roomId) {
      socket.emit('peer-info', { displayName: localDisplayName })
    }
  }, [])

  return (
    <>
      <div className='p-4'>
        <div className='flex justify-between items-center'>
          <h1 className='font-semibold'>Web RTC</h1>
          <Button color='danger' variant='solid' style={{ width: '120px' }}>
            Leave
          </Button>
        </div>

        <div className='mt-16 grid grid-cols-3 gap-4 h-100'>
          <LocalVideo />
          <RemoteVideo stream={remoteStream} />
          <div className='border border-[#ccc] rounded-md p-2 h-full'>
            <div className='rounded-2xl h-100 overflow-y-auto'>
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

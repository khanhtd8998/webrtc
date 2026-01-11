import { Button, Input } from 'antd'
import { SendHorizontal } from 'lucide-react'
import { useParams } from 'react-router'
import { useMeetingActions } from '../../hooks/useMeetingActions'
import { usePeerConnection } from '../../hooks/usePeerConnection'
import { LocalVideo } from './components/LocalVideo'
import { RemoteVideo } from './components/RemoteVideo'
import { useChat } from '../../hooks/useChat'
import { useState } from 'react'
import ChatSection from './components/ChatSection'
import { useMediaStore } from '../../store/MediaStore'

const MeetingScreenPage = () => {
  const { roomId } = useParams()
  if (!roomId) return null
  const isHost = sessionStorage.getItem('meeting-role') === 'host'
  const { remoteStream } = usePeerConnection(roomId, isHost)
  const { remoteDisplayName } = useMeetingActions()
  const localDisplayName = useMediaStore((s) => s.devices.displayName)



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
          <LocalVideo localDisplayName={localDisplayName} />
          <RemoteVideo stream={remoteStream} displayName={remoteDisplayName} />
          <ChatSection roomId={roomId} localDisplayName={localDisplayName} remoteDisplayName={remoteDisplayName}/>
        </div>
      </div>
    </>
  )
}

export default MeetingScreenPage

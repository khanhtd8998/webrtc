import { Button } from 'antd'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { socket } from '../../configs/socket'
import { useMeetingActions } from '../../hooks/useMeetingActions'
import { useWebRTCVideo } from '../../hooks/useWebRTCVideo'
import { useMediaStore } from '../../store/MediaStore'
import ChatSection from './components/ChatSection'
import { LocalVideo } from './components/LocalVideo'
import { RemoteVideo } from './components/RemoteVideo'

const MeetingScreenPage = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const { roomId } = useParams()
  if (!roomId) return null
  const isHost = sessionStorage.getItem('meeting-role') === 'host'
  const { remoteStream } = useWebRTCVideo(roomId, isHost)
  const { remoteDisplayName, participantsCount, leaveMeeting } = useMeetingActions()
  const localDisplayName = useMediaStore((s) => s.devices.displayName)

  useEffect(() => {
    socket.emit('get-room-peers', { roomId })
  }, [])

  const handleLeaveMeeting = () => {
    leaveMeeting()
  }

  return (
    <>
      <div className='p-4'>
        <div className='flex justify-between items-center'>
          <h1 className='font-semibold'>Web RTC</h1>
          <div>
            Số người: <strong>{participantsCount}</strong>
          </div>
          <Button onClick={handleLeaveMeeting} color='danger' variant='solid' style={{ width: '120px' }}>
            Leave
          </Button>
        </div>

        <div className='mt-16 grid grid-cols-3 gap-4 h-100'>
          <LocalVideo videoRef={videoRef} />
          <RemoteVideo stream={remoteStream} displayName={remoteDisplayName} />
          <ChatSection roomId={roomId} localDisplayName={localDisplayName} remoteDisplayName={remoteDisplayName} />
        </div>
      </div>
    </>
  )
}

export default MeetingScreenPage

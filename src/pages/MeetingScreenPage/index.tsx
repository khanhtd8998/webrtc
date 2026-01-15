import { Button } from 'antd'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { socket } from '../../configs/socket'
import { useLocalPreview } from '../../hooks/useLocalPreview'
import { useMeetingActions } from '../../hooks/useMeetingActions'
import { useWebRTC } from '../../hooks/useWebRTC'
import { useMediaStore } from '../../store/MediaStore'
import ChatSection from './components/ChatSection'
import { LocalVideo } from './components/LocalVideo'
import { RemoteVideo } from './components/RemoteVideo'

const MeetingScreenPage = () => {
  const { roomId } = useParams()
  if (!roomId) return null
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const { remoteDisplayName, participantsCount, leaveMeeting } = useMeetingActions()
  const { stream, videoEnabled, audioEnabled } = useLocalPreview()
  const { replaceTrack } = useWebRTC(roomId, stream, remoteVideoRef)
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
          <LocalVideo
            onUpdateVideoStream = {() => replaceTrack('video', videoEnabled)}
            onUpdateAudioStream = {() => replaceTrack('audio', audioEnabled)}
           />
          <RemoteVideo remoteVideoRef={remoteVideoRef} displayName={remoteDisplayName} />
          <ChatSection roomId={roomId} localDisplayName={localDisplayName} remoteDisplayName={remoteDisplayName} />
        </div>
      </div>
    </>
  )
}

export default MeetingScreenPage

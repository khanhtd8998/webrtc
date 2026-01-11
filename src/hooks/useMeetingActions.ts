import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { socket } from '../configs/socket'
import { useMediaStore } from '../store/MediaStore'

export const useMeetingActions = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remoteDisplayName, setRemoteDisplayName] = useState<string | undefined>(undefined)
  const localDisplayName = useMediaStore((s) => s.devices.displayName)

  const createMeeting = () => {
    if (loading) return
    setLoading(true)
    setError(null)
    socket.emit('create-room')
  }

  const joinMeeting = (roomId: string) => {
    if (loading) return
    if (!roomId || roomId.length < 4) {
      setError('Invalid meeting code')
      return
    }

    setLoading(true)
    setError(null)

    sessionStorage.setItem('meeting-room', roomId)
    sessionStorage.setItem('meeting-role', 'guest')
    socket.emit('join-room', { roomId })

    // Gửi displayName của mình ngay sau khi join
    if (localDisplayName) {
      socket.emit('peer-info', { displayName: localDisplayName })
    }
  }

  useEffect(() => {
    const onRoomCreated = ({ roomId }: { roomId: string }) => {
      setLoading(false)
      sessionStorage.setItem('meeting-room', roomId)
      sessionStorage.setItem('meeting-role', 'host')
      navigate(`/meeting/${roomId}`, { state: { isHost: true } })
    }

    const onRoomJoined = () => {
      setLoading(false)
      const roomId = sessionStorage.getItem('meeting-room')
      if (!roomId) return
      navigate(`/meeting/${roomId}`, { state: { isHost: false } })
    }

    const onRoomError = ({ message }: { message: string }) => {
      setLoading(false)
      setError(message)
    }

    const onPeerInfo = ({ displayName }: { displayName: string }) => {
      setRemoteDisplayName(displayName)
    }

    socket.on('room-created', onRoomCreated)
    socket.on('room-joined', onRoomJoined)
    socket.on('room-error', onRoomError)
    socket.on('peer-info', onPeerInfo)

    return () => {
      socket.off('room-created', onRoomCreated)
      socket.off('room-joined', onRoomJoined)
      socket.off('room-error', onRoomError)
      socket.off('peer-info', onPeerInfo)
    }
  }, [navigate, localDisplayName])

  return {
    createMeeting,
    joinMeeting,
    loading,
    error,
    remoteDisplayName
  }
}

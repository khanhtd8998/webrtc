// hooks/useMeetingActions.ts
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

  // CREATE MEETING
  const createMeeting = () => {
    if (loading) return
    setLoading(true)
    setError(null)
    socket.emit('create-room')
  }

  // JOIN MEETING
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

        if (localDisplayName) {
      socket.emit('peer-info', { displayName: localDisplayName })
    }
  }

  // SOCKET LISTENERS
  useEffect(() => {
    //ROOM CREATED
    const onRoomCreated = ({ roomId }: { roomId: string }) => {
      setLoading(false)

      sessionStorage.setItem('meeting-room', roomId)
      sessionStorage.setItem('meeting-role', 'host')

      navigate(`/meeting/${roomId}`, {
        state: { isHost: true }
      })
    }

    // 🔔 JOIN OK
    const onRoomJoined = () => {
      setLoading(false)

      const roomId = sessionStorage.getItem('meeting-room')
      if (!roomId) return

      navigate(`/meeting/${roomId}`, {
        state: { isHost: false }
      })

      if (localDisplayName) {
        socket.emit('peer-info', { displayName: localDisplayName })
      }
    }

    //ERROR
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

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { socket } from '../configs/socket'
import { useMediaStore } from '../store/MediaStore'

type PeerInfoPayload = { socketId: string; displayName: string | null }
export const useMeetingActions = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remoteDisplayName, setRemoteDisplayName] = useState<string | undefined>(undefined)
  const localDisplayName = useMediaStore((s) => s.devices.displayName)
  const [participantsCount, setParticipantsCount] = useState<number>(0)

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
  }

  const leaveMeeting = () => {
    const roomId = sessionStorage.getItem('meeting-room')
    if (roomId) {
      socket.emit('leave-room', { roomId })
    }
    sessionStorage.removeItem('meeting-room')
    sessionStorage.removeItem('meeting-role')
    setRemoteDisplayName(undefined)
    setParticipantsCount(0)
    navigate('/')
  }

  useEffect(() => {
    const onRoomCreated = ({ roomId }: { roomId: string }) => {
      setLoading(false)
      sessionStorage.setItem('meeting-room', roomId)
      sessionStorage.setItem('meeting-role', 'host')
      if (localDisplayName) {
        socket.emit('peer-info', { displayName: localDisplayName })
      }
      setParticipantsCount(1)
      navigate(`/meeting/${roomId}`, { state: { isHost: true } })
    }

    const onRoomJoined = () => {
      setLoading(false)
      const roomId = sessionStorage.getItem('meeting-room')
      if (!roomId) return
      if (localDisplayName) {
        socket.emit('peer-info', { displayName: localDisplayName })
      }
      navigate(`/meeting/${roomId}`, { state: { isHost: false } })
    }

    const onRoomError = ({ message }: { message: string }) => {
      setLoading(false)
      setError(message)
    }

    const onRoomPeers = ({ peers }: { peers: Array<PeerInfoPayload> }) => {
      const myId = socket.id
      const remote = peers.find((p) => p.socketId !== myId && !!p.displayName)
      setRemoteDisplayName(remote?.displayName ?? undefined)
      setParticipantsCount(peers.length)
    }

    const onPeerInfo = ({ displayName }: { displayName: string }) => {
      setRemoteDisplayName(displayName)
    }

    socket.on('room-created', onRoomCreated)
    socket.on('room-joined', onRoomJoined)
    socket.on('room-peers', onRoomPeers)
    socket.on('room-error', onRoomError)
    socket.on('peer-info', onPeerInfo)

    return () => {
      socket.off('room-created', onRoomCreated)
      socket.off('room-joined', onRoomJoined)
      socket.off('room-peers', onRoomPeers)
      socket.off('room-error', onRoomError)
      socket.off('peer-info', onPeerInfo)
    }
  }, [navigate, localDisplayName])
  

  return {
    createMeeting,
    joinMeeting,
    leaveMeeting,
    loading,
    error,
    remoteDisplayName,
    participantsCount
  }
}

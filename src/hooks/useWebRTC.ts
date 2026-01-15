import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { socket } from '../configs/socket'
export type RemoteState = 'waiting' | 'connected' | 'streaming'

export function useWebRTC(
  roomId: string,
  localStream: MediaStream | null,
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>
) {
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const [remoteState, setRemoteState] = useState<RemoteState>('waiting')

  const cleanup = () => {
    pcRef.current?.close()
    pcRef.current = null

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }
    setRemoteState('waiting')
  }

  const replaceTrack = (kind: 'audio' | 'video', isEnabled: boolean) => {
    const sender = pcRef.current?.getSenders().find((s) => s.track?.kind === kind)
    if (!sender) return
    const newTrack = localStream?.getTracks().find((s) => s.kind === kind)
    if (!newTrack) return
    newTrack.enabled = !isEnabled
    sender.replaceTrack(newTrack)
  }

  useEffect(() => {
    if (!roomId || !localStream) return
    if (pcRef.current) return
    console.log(1)
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })
    pcRef.current = pc

    console.log(2)
    localStream.getTracks().forEach((track) => {
      console.log(track)
      pc.addTrack(track, localStream)
    })

    pc.ontrack = (event) => {
      if (!remoteVideoRef.current) return
      console.log('ontrack:', event.track.kind)

      remoteVideoRef.current.srcObject = event.streams[0]
      remoteVideoRef.current
        .play()
        .then(() => setRemoteState('streaming'))
        .catch(() => setRemoteState('connected'))
    }

    pc.onicecandidate = (e) => {
      console.log(5.1)
      if (e.candidate) {
        socket.emit('webrtc:ice', {
          roomId,
          candidate: e.candidate
        })
      }
    }

    console.log(3)
    socket.emit('webrtc:join', roomId)

    socket.on('webrtc:role', async ({ isOfferer }) => {
      console.log(4)
      if (!isOfferer) return
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      console.log(5)
      socket.emit('webrtc:offer', { roomId, sdp: offer })
    })

    socket.on('webrtc:offer', async ({ sdp }) => {
      await pc.setRemoteDescription(sdp)
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      socket.emit('webrtc:answer', { roomId, sdp: answer })
      setRemoteState('connected')
    })

    socket.on('webrtc:answer', async ({ sdp }) => {
      console.log(6)
      await pc.setRemoteDescription(sdp)
      setRemoteState('connected')
    })

    socket.on('webrtc:ice', (c) => {
      console.log('final')
      pc.addIceCandidate(c)
    })
    socket.on('webrtc:peer-left', cleanup)

    return () => {
      cleanup()
      socket.off('webrtc:role')
      socket.off('webrtc:offer')
      socket.off('webrtc:answer')
      socket.off('webrtc:ice')
      socket.off('webrtc:peer-left')
    }
  }, [roomId, localStream])

  const leaveRoom = () => {
    socket.emit('webrtc:leave', roomId)
    cleanup()
  }

  return { remoteState, leaveRoom, replaceTrack }
}

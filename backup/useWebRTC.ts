import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { socket } from '../configs/socket'
import { useCurrentUser } from './useCurrentUser'

export type RemoteState = 'waiting' | 'connected' | 'streaming'

export function useWebRTC(
  roomId: string,
  localStream: MediaStream | null,
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>
) {
  const { idUser } = useCurrentUser()

  const pcRef = useRef<RTCPeerConnection | null>(null)
  const remoteStreamRef = useRef<MediaStream | null>(null)
  const [remoteState, setRemoteState] = useState<RemoteState>('waiting')

  /* ================= ENSURE PC ================= */
  const ensurePeerConnection = () => {
    if (pcRef.current) return pcRef.current

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })
    pcRef.current = pc

    // add local tracks ONCE
    localStream?.getTracks().forEach((track) => {
      pc.addTrack(track, localStream)
    })

    // remote stream
    remoteStreamRef.current = new MediaStream()

    pc.ontrack = (e) => {
      e.streams[0].getTracks().forEach((t) => {
        remoteStreamRef.current?.addTrack(t)
      })

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current
        remoteVideoRef.current
          .play()
          .then(() => setRemoteState('streaming'))
          .catch(() => setRemoteState('connected'))
      }
    }

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit('webrtc:ice', {
          roomId,
          candidate: e.candidate
        })
      }
    }

    return pc
  }

  /* ================= CLEANUP ================= */
  const cleanup = () => {
    pcRef.current?.close()
    pcRef.current = null
    remoteStreamRef.current = null

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }

    setRemoteState('waiting')
  }

  /* ================= EFFECT ================= */
  useEffect(() => {
    if (!roomId || !localStream || localStream.getTracks().length === 0) return

    ensurePeerConnection()


    // === ROOM READY (OWNER CREATE OFFER) ===
    socket.on('room:ready', async ({ ownerId }) => {
      if (ownerId !== idUser) return

      const pc = ensurePeerConnection()
      if (pc.signalingState !== 'stable') return

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      socket.emit('webrtc:offer', { roomId, offer })
    })

    // === RECEIVE OFFER → CREATE ANSWER ===
    socket.on('webrtc:offer', async ({ offer }) => {
      const pc = ensurePeerConnection()

      if (pc.signalingState !== 'stable') return

      await pc.setRemoteDescription(offer)
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      socket.emit('webrtc:answer', { roomId, answer })
      setRemoteState('connected')
    })

    // === RECEIVE ANSWER ===
    socket.on('webrtc:answer', async ({ answer }) => {
      const pc = ensurePeerConnection()

      if (pc.signalingState !== 'have-local-offer') return

      await pc.setRemoteDescription(answer)
      setRemoteState('connected')
    })

    // === ICE ===
    socket.on('webrtc:ice', async ({ candidate }) => {
      const pc = ensurePeerConnection()
      await pc.addIceCandidate(candidate)
    })

    socket.on('webrtc:peer-left', cleanup)

    return () => {
      cleanup()
      socket.off('room:ready')
      socket.off('webrtc:offer')
      socket.off('webrtc:answer')
      socket.off('webrtc:ice')
      socket.off('webrtc:peer-left')
    }
  }, [roomId, localStream])

  /* ================= TOGGLE MIC / CAM ================= */
  const toggleTrack = (kind: 'audio' | 'video', enabled: boolean) => {
    const track = localStream?.getTracks().find((t) => t.kind === kind)
    if (track) track.enabled = enabled
  }

  const leaveRoom = () => {
    socket.emit('webrtc:leave', { roomId })
    cleanup()
  }

  return {
    remoteState,
    leaveRoom,
    toggleTrack
  }
}

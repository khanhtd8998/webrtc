// hooks/usePeerConnection.ts
import { useEffect, useRef, useState } from 'react'
import { socket } from '../configs/socket'
import { useMediaStreamStore } from '../store/MediaStreamStore'

const ICE_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
}

export const usePeerConnection = (roomId: string, isHost: boolean) => {
  const localStream = useMediaStreamStore((s) => s.stream)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  // 1️⃣ init peer connection
  useEffect(() => {
    const pc = new RTCPeerConnection(ICE_CONFIG)
    pcRef.current = pc

    const remote = new MediaStream()
    setRemoteStream(remote)

    pc.ontrack = (e) => {
      e.streams[0].getTracks().forEach((t) => remote.addTrack(t))
    }

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit('signal', {
          roomId,
          data: { type: 'ice', candidate: e.candidate }
        })
      }
    }

    return () => {
      pc.close()
      pcRef.current = null
    }
  }, [roomId])

  // 2️⃣ add local tracks (luôn sync)
  useEffect(() => {
    const pc = pcRef.current
    if (!pc || !localStream) return

    localStream.getTracks().forEach((track) => {
      const sender = pc.getSenders().find((s) => s.track?.kind === track.kind)

      if (!sender) {
        pc.addTrack(track, localStream)
      } else if (sender.track !== track) {
        sender.replaceTrack(track)
      }
    })
  }, [localStream])

  // signaling handler
  //@ts-ignore
  useEffect(() => {
    const pc = pcRef.current
    if (!pc) return

    const onSignal = async ({ data }: any) => {
      if (data.type === 'offer') {
        await pc.setRemoteDescription(data.sdp)
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)

        socket.emit('signal', {
          roomId,
          data: { type: 'answer', sdp: answer }
        })
      }

      if (data.type === 'answer') {
        await pc.setRemoteDescription(data.sdp)
      }

      if (data.type === 'ice') {
        await pc.addIceCandidate(data.candidate)
      }
    }

    socket.on('signal', onSignal)
    return () => socket.off('signal', onSignal)
  }, [roomId])

  //host create offer
  //@ts-ignore
  useEffect(() => {
    if (!isHost) return
    const pc = pcRef.current
    if (!pc) return

    const createOffer = async () => {
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      socket.emit('signal', {
        roomId,
        data: { type: 'offer', sdp: offer }
      })
    }

    socket.on('peer-joined', createOffer)
    return () => socket.off('peer-joined', createOffer)
  }, [roomId, isHost])

  return { remoteStream }
}

import { useEffect, useState } from 'react'
import { useMediaStreamStore } from '../store/MediaStreamStore'
import { socket } from '../configs/socket'

const rtcConfig: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }],
  iceCandidatePoolSize: 10
}

export const useWebRTCVideo = (roomId: string, isHost: boolean) => {
  const localStream = useMediaStreamStore((s) => s.stream)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    const pc = new RTCPeerConnection(rtcConfig)

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream)
      })
    }

    pc.ontrack = (event) => {
      console.log(event)
      setRemoteStream((prev) => {
        const stream = prev ?? new MediaStream()
        stream.addTrack(event.track)
        return stream
      })
    }

    socket.on('offer', async (offer: RTCSessionDescriptionInit) => {
      if (isHost) return
      await pc.setRemoteDescription(offer)
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      socket.emit('answer', { roomId, answer })
    })

    socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
      await pc.setRemoteDescription(answer)
    })

    socket.on('ice-candidate', async (candidate: RTCIceCandidateInit) => {
      if (pc.remoteDescription) {
        await pc.addIceCandidate(candidate)
      }
    })

    if (isHost) {
      socket.on('peer-joined', async () => {
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        })
        await pc.setLocalDescription(offer)

        socket.emit('offer', { roomId, offer })
      })
    }

    return () => {
      socket.off('offer')
      socket.off('answer')
      socket.off('ice-candidate')
      socket.off('peer-joined')
      pc.close()
    }
  }, [localStream, roomId, isHost])

  return { remoteStream }
}

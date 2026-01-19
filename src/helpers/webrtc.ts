import { socket } from "../configs/socket"

let pc: RTCPeerConnection | null = null

function ensurePeerConnection(localStream: MediaStream, remoteVideo: HTMLVideoElement, roomId: string) {
  if (pc) return pc

  pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  })

  localStream.getTracks().forEach((track) => {
    pc!.addTrack(track, localStream)
  })

  pc.ontrack = (e) => {
    remoteVideo.srcObject = e.streams[0]
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

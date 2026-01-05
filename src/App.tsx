import { useEffect, useRef, useState } from 'react'
import './App.css'

const offerOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true
}

function App() {
  const localCamRef = useRef<HTMLVideoElement>(null)
  const remoteCamRef = useRef<HTMLVideoElement>(null)
  const [micOn, setMicOn] = useState<boolean>(true)
  const [onStream, setOnStream] = useState<boolean>(false)

  useEffect(() => {
    return () => handleTurnOffCamera()
  }, [])

  const getStream = () => localCamRef.current?.srcObject as MediaStream | null

  const handleTurnOnCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 720,
          height: 360,
          frameRate: 30
        }
      })
      if (localCamRef.current) {
        localCamRef.current.srcObject = stream
        setOnStream(true)
      }
    } catch (error) {
      setOnStream(false)
      console.log(error)
    }
  }

  const handleTurnOffCamera = () => {
    getStream()
      ?.getTracks()
      .forEach((track) => track.stop())
    if (localCamRef.current) localCamRef.current.srcObject = null
    setOnStream(false)
  }

  const handleToggleMicrophone = () => {
    const stream = getStream()
    if (!stream) return
    const state = !micOn
    stream.getAudioTracks().forEach((track) => (track.enabled = state))
    setMicOn(state)
  }

  const handleCall = () => {
    const p1 = new RTCPeerConnection()
    const p2 = new RTCPeerConnection()
    const stream = getStream()
    if (!stream) return
    stream.getTracks().forEach((track) => p1.addTrack(track, stream))
    p1.onicecandidate = (e) => {
      if (e.candidate) p2.addIceCandidate(e.candidate)
    }
    p2.onicecandidate = (e) => {
      if (e.candidate) p1.addIceCandidate(e.candidate)
    }

    p2.ontrack = (e) => {
      if (remoteCamRef.current) {
        remoteCamRef.current.srcObject = e.streams[0]
      }
    }

    const makeCall = async () => {
      const offer = await p1.createOffer(offerOptions)
      await p1.setLocalDescription(offer)
      await p2.setRemoteDescription(offer)
      const answer = await p2.createAnswer()
      await p2.setLocalDescription(answer)
      await p1.setRemoteDescription(answer)
    }
    makeCall();
  }

  return (
    <>
      <h1 className='mb-8 text-center'>Demo WebRTC</h1>
      <div className='flex gap-4 w-full justify-center'>
        <video
          className='w-180 h-120 object-cover bg-black/80 rounded-2xl'
          ref={localCamRef}
          autoPlay
          playsInline
        ></video>
        <video
          className='w-180 h-120 object-cover bg-black/80 rounded-2xl'
          ref={remoteCamRef}
          autoPlay
          playsInline
        ></video>
      </div>
      <div className='flex gap-4 justify-center mt-8'>
        <button onClick={handleTurnOnCamera}>Turn on Camera</button>
        <button onClick={handleCall}>Call</button>
        <button disabled={!onStream} className='disabled:opacity-50' onClick={handleTurnOffCamera}>
          Turn off Camera
        </button>
        <button
          disabled={!onStream}
          className={`disabled:opacity-50 ${micOn ? 'bg-green-500' : 'bg-red-500'}`}
          onClick={handleToggleMicrophone}
        >
          {micOn ? '🎤 Mic On' : '🔇 Mic Off'}
        </button>
      </div>
    </>
  )
}

export default App

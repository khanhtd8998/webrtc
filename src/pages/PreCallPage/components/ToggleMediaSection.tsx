import { Camera, CameraOff, Mic, MicOff } from 'lucide-react'
import { ToggleMediaButton } from '../../../components/ToggleMediaButton'
import { useMediaStore } from '../../../store/MediaStore'
import { useMediaStreamStore } from '../../../store/MediaStreamStore'

const ToggleMediaSection = () => {
  const isVideoEnabled = useMediaStreamStore((s) => s.isVideoEnabled)
  const isAudioEnabled = useMediaStreamStore((s) => s.isAudioEnabled)
  const videoTrack = useMediaStreamStore((s) => s.videoTrack)
  const audioTrack = useMediaStreamStore((s) => s.audioTrack)
  const toggleVideo = useMediaStreamStore((s) => s.toggleVideo)
  const toggleAudio = useMediaStreamStore((s) => s.toggleAudio)
  const errors = useMediaStore((s) => s.errors)

  return (
    <>
      {!errors?.audio && (
        <ToggleMediaButton
          enabled={isAudioEnabled}
          disabled={!audioTrack}
          onClick={() => {
            if (!audioTrack) return
            toggleAudio(!audioTrack.enabled)
          }}
          iconOn={<Mic />}
          iconOff={<MicOff />}
        />
      )}

      {!errors?.video && (
        <ToggleMediaButton
          enabled={isVideoEnabled}
          disabled={!videoTrack}
          onClick={() => {
            if (!videoTrack) return
            toggleVideo(!videoTrack.enabled)
          }}
          iconOn={<Camera />}
          iconOff={<CameraOff />}
        />
      )}
    </>
  )
}

export default ToggleMediaSection

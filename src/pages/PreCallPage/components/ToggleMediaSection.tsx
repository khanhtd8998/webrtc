import { Camera, CameraOff, Mic, MicOff } from 'lucide-react'
import { ToggleMediaButton } from '../../../components/ToggleMediaButton'
import type { MediaDeviceError } from '../../../types/media'
const ToggleMediaSection = ({
  videoEnabled,
  audioEnabled,
  toggleVideo,
  toggleAudio,
  errors
}: {
  videoEnabled: boolean
  audioEnabled: boolean
  toggleVideo: () => void
  toggleAudio: () => void
  errors?: MediaDeviceError
}) => {
  return (
    <>
      {!errors?.audio && (
        <ToggleMediaButton
          enabled={audioEnabled}
          disabled={!!errors?.audio}
          onClick={toggleAudio}
          iconOn={<Mic />}
          iconOff={<MicOff />}
        />
      )}

      {!errors?.video && (
        <ToggleMediaButton
          enabled={videoEnabled}
          disabled={!!errors?.video}
          onClick={toggleVideo}
          iconOn={<Camera />}
          iconOff={<CameraOff />}
        />
      )}
    </>
  )
}

export default ToggleMediaSection

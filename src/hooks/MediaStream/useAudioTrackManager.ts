import { useEffect } from "react"
import { useMediaStore } from "../../store/MediaStore"
import { useMediaStreamStore } from "../../store/MediaStreamStore"

export const useAudioTrackManager = () => {
  const microphoneId = useMediaStore((s) => s.devices.microphoneId)
  const {
    audioTrack,
    setAudioTrack,
    isAudioEnabled
  } = useMediaStreamStore()

  useEffect(() => {
    if (!microphoneId) return

    if (
      audioTrack &&
      audioTrack.getSettings().deviceId === microphoneId
    ) {
      return
    }

    const run = async () => {
      if (audioTrack) audioTrack.stop()

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: microphoneId } },
        video: false,
      })

      const track = stream.getAudioTracks()[0]
      track.enabled = isAudioEnabled
      setAudioTrack(track)
    }

    run()
  }, [microphoneId])
}

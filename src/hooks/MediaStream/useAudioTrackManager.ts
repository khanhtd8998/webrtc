// hooks/useAudioTrackManager.ts
import { useEffect } from 'react'
import { useMediaStore } from '../../store/MediaStore'
import { useMediaStreamStore } from '../../store/MediaStreamStore'

export const useAudioTrackManager = () => {
  const microphoneId = useMediaStore((s) => s.devices.microphoneId)
  const setAudioTrack = useMediaStreamStore((s) => s.setAudioTrack)

  useEffect(() => {
    if (!microphoneId) return

    const run = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: { deviceId: { exact: microphoneId } }
      })

      const track = stream.getAudioTracks()[0]
      setAudioTrack(track)
    }

    run()
  }, [microphoneId])
}

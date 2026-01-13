import { useEffect, useRef } from 'react'
import { VideoPreview } from '../../components/VideoPreview'
import { useMeetingActions } from '../../hooks/useMeetingActions'
import { useMediaStore } from '../../store/MediaStore'
import ActionMeetingSection from './components/ActionMeetingSection'
import { useLocalPreview } from '../../hooks/useLocalPreview'

const PreCallPage = () => {
  const { createMeeting, joinMeeting, loading, error } = useMeetingActions()
  const devices = useMediaStore((s) => s.devices)

  useEffect(() => {
    console.log('precall', devices)
  }, [])

  return (
    <>
      <div className='max-w-3xl mx-auto p-4'>
        <div className='mt-4 flex gap-4 items-center w-full'>
          <ActionMeetingSection onJoin={joinMeeting} onCreate={createMeeting} loading={loading} error={error} />
        </div>
        <div className='mt-4'>
          <VideoPreview />
        </div>
      </div>
    </>
  )
}

export default PreCallPage

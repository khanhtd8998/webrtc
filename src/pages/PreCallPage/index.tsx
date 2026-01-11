import { VideoPreview } from '../../components/VideoPreview'
import { useMeetingActions } from '../../hooks/useMeetingActions'
import ActionMeetingSection from './components/ActionMeetingSection'
import ToggleMediaSection from './components/ToggleMediaSection'

const PreCallPage = () => {
  const { createMeeting, joinMeeting, loading, error } = useMeetingActions()

  return (
    <>
      <div className='max-w-3xl mx-auto p-4'>
        <div className='mt-4 flex gap-4 items-center w-full'>
          <ActionMeetingSection onJoin={joinMeeting} onCreate={createMeeting} loading={loading} error={error} />
        </div>
        <div className='mt-4'>
          <VideoPreview />
        </div>
        <div className='flex justify-center mt-4 gap-4'>
          <ToggleMediaSection />
        </div>
      </div>
    </>
  )
}

export default PreCallPage

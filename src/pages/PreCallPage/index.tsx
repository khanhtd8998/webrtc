import { Button, Input } from 'antd'
import { useNavigate } from 'react-router'
import { VideoPreview } from '../../components/VideoPreview'
import ToggleMediaSection from './components/ToggleMediaSection'

const HomeMediaPage = () => {
  const navigate = useNavigate()

  return (
    <>
      <div className='max-w-3xl mx-auto p-4'>
        <div className='mt-16 flex items-center gap-4'>
          <Input id='link-meeting' placeholder='Enter link Meeting' />
          <Button onClick={() => navigate('/meeting')} type='primary'>
            Join
          </Button>
          <Button type='primary'>Create Meeting</Button>
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

export default HomeMediaPage

import { Button, Input } from 'antd'
import { useState } from 'react'
type Props = {
  onJoin: (roomId: string) => void
  onCreate: () => void
  loading: boolean
  error?: string | null
}

const ActionMeetingSection = ({ onJoin, onCreate, loading, error }: Props) => {
  const [roomId, setRoomId] = useState('')

  return (
    <>
      <div className='w-full'>
        <div className='flex gap-2'>
          <Input
            value={roomId}
            placeholder='Enter meeting code'
            onChange={(e) => setRoomId(e.target.value)}
            disabled={loading}
          />
          <Button type='primary' onClick={() => onJoin(roomId)} loading={loading}>
            Join
          </Button>
          <Button onClick={onCreate} loading={loading} disabled={loading} type='primary'>
            Create Meeting
          </Button>
        </div>
        {error && <span className='text-red-500 text-sm'>{error}</span>}
      </div>
    </>
  )
}

export default ActionMeetingSection

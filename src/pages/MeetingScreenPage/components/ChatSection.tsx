import { Button, Input } from 'antd'
import { SendHorizontal } from 'lucide-react'
import { useChat } from '../../../hooks/useChat'
import { useState } from 'react'

type Props = {
  roomId: string
  localDisplayName?: string
  remoteDisplayName?: string
}

const ChatSection = ({ roomId, localDisplayName, remoteDisplayName }: Props) => {
  const { messages, sendMessage } = useChat(roomId)
  const [text, setText] = useState('')
  return (
    <>
      <div className='border border-[#ccc] rounded-md p-2 h-full'>
        <div className='rounded-2xl h-100 overflow-y-auto'>
          {messages.map((m, i) => {
            const isMe = m.from === 'me'
            const name = isMe ? localDisplayName || 'You' : remoteDisplayName || 'Guest'

            return (
              <div key={i} className={`mb-2 px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                <span className='block text-xs text-gray-500'>{name}</span>
                <p
                  className={`inline-block text-start p-2 break-all rounded ${isMe ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                >
                  {m.message}
                </p>
              </div>
            )
          })}
        </div>
        <div className='flex gap-2 mt-3'>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Type message...'
            onPressEnter={() => {
              sendMessage(text)
              setText('')
            }}
          />
          <Button
            shape='circle'
            size='large'
            onClick={() => {
              sendMessage(text)
              setText('')
            }}
          >
            <SendHorizontal />
          </Button>
        </div>
      </div>
    </>
  )
}

export default ChatSection

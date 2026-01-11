import { useEffect, useState } from 'react'
import { socket } from '../configs/socket'

export interface ChatMessage {
  from: string
  message: string
  timestamp: number
}

export const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const sendMessage = (message: string) => {
    if (!message.trim()) return

    socket.emit('chat-message', {
      roomId,
      message
    })

    // add local message ngay lập tức
    setMessages((prev) => [
      ...prev,
      {
        from: 'me',
        message,
        timestamp: Date.now()
      }
    ])
  }

  //@ts-ignore
  useEffect(() => {
    const onMessage = (data: ChatMessage) => {
      setMessages((prev) => [...prev, data])
    }

    socket.on('chat-message', onMessage)
    return () => socket.off('chat-message', onMessage)
  }, [])

  return {
    messages,
    sendMessage
  }
}

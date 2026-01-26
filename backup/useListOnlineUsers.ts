import { useEffect, useState } from 'react'
import { useSettingStore } from '../../stores/settingStores'
import { getUserId } from '../../helpers/room/userId'
import { socket } from '../../lib/socket'

export type ListUser = {
  idUser: string
  username?: string
  online?: boolean
}

export function useListOnlineUsers() {
  const setting = useSettingStore((s) => s.settings)
  const [users, setUsers] = useState<ListUser[]>([])

  useEffect(() => {
    const me = {
      idUser: getUserId(),
      username: setting?.displayName ?? ''
    }

    socket.emit('user:register', me)
    socket.emit('user:get')

    /**
    "user:register" → { idUser: "u1", username: "Khánh" }
    "user:get"
     */

    const onList = (list: ListUser[]) => setUsers(list)
    const onPresence = (list: ListUser[]) => setUsers(list)

    socket.on('users:list', onList)
    socket.on('users:presence', onPresence)

    return () => {
      socket.off('users:list', onList)
      socket.off('users:presence', onPresence)
    }
  }, [setting?.displayName])

  return users
}

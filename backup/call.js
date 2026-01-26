import { randomUUID } from 'crypto'

const userCatalog = new Map()
const onlineUsers = new Map()
const activeCall = new Map()

function mergedList() {
  return Array.from(userCatalog.values()).map((u) => ({
    ...u,
    online: onlineUsers.has(u.idUser)
  }))
}

export function wireCalls(io, socket, rooms) {
  // ======================
  // USER REGISTER
  // ======================
  socket.on('user:register', ({ idUser, username }) => {
    if (!idUser) return

    socket.data.userId = idUser
    /**
     * Gắn userId vào socket data
     * socket.data = { userId: "u1" }
     */

    onlineUsers.set(idUser, {
      socketId: socket.id,
      username: username ?? ''
    })
    /**
    onlineUsers = {"u1" => { socketId: "abc123", username: "Khánh" }}
    */

    const prev = userCatalog.get(idUser) || {}
    userCatalog.set(idUser, {
      idUser,
      username: username ?? prev.username ?? idUser
    })
    /**
     * userCatalog lưu lâu dài, không phụ thuộc online/offline:
     * userCatalog = { "u1" => { idUser: "u1", username: "Khánh" }
     */

    socket.emit('users:list', mergedList())
    io.emit('users:presence', mergedList())
  })

  socket.on('users:get', () => {
    socket.emit('users:list', mergedList())
  })

  // ======================
  // CALL REQUEST
  // ======================
  socket.on('call:request', ({ toUserId }) => {
    const fromUserId = socket.data.userId
    if (!fromUserId || !toUserId || fromUserId === toUserId) return

    const to = onlineUsers.get(toUserId)
    if (!to) {
      socket.emit('call:failed', { reason: 'offline' })
      return
    }

    const callId = randomUUID()
    activeCall.set(callId, {
      fromUserId,
      toUserId,
      status: 'ringing'
    })

    io.to(to.socketId).emit('call:incoming', {
      callId,
      from: {
        idUser: fromUserId,
        username: onlineUsers.get(fromUserId)?.username || ''
      }
    })
  })

  // ======================
  // CALL ACCEPT / REJECT
  // ======================
  socket.on('call:accept', ({ callId, accept }) => {
    const call = activeCall.get(callId)
    if (!call) return
    //👉 Chỉ người được gọi mới được accept
    if (socket.data.userId !== call.toUserId) return

    const callerSocketId = onlineUsers.get(call.fromUserId)?.socketId

    if (!callerSocketId) {
      activeCall.delete(callId)
      return
    }

    if (!accept) {
      io.to(callerSocketId).emit('call:rejected', { callId })
      activeCall.delete(callId)
      return
    }

    // ACCEPT → tạo roomId, caller là owner
    const roomId = randomUUID().slice(0, 8)
    activeCall.set(callId, {
      ...call,
      status: 'accepted',
      roomId
    })

    io.to(callerSocketId).emit('call:accepted', {
      callId,
      roomId,
      role: 'owner',
      ownerId: call.fromUserId
    })

    io.to(socket.id).emit('call:accepted', {
      callId,
      roomId,
      role: 'guest',
      ownerId: call.fromUserId
    })
  })

  // ======================
  // CALL CANCEL
  // ======================
  /**
   * Người GỌI (caller) chủ động huỷ cuộc gọi
   * Khi cuộc gọi vẫn đang ở trạng thái ringing
   */
  socket.on('call:cancel', ({ callId }) => {
    const call = activeCall.get(callId)
    if (!call) return
    if (socket.data.userId !== call.fromUserId) return

    const calleeSocketId = onlineUsers.get(call.toUserId)?.socketId

    if (calleeSocketId) {
      io.to(calleeSocketId).emit('call:cancelled', { callId })
    }

    activeCall.delete(callId)
  })

  // ======================
  // DISCONNECT CLEANUP
  // ======================
  socket.on('disconnect', () => {
    const uid = socket.data.userId

    //Tránh đè nhầm session khác
    /*
    | Tình huống          | Giải thích                    |
    | ------------------- | ----------------------------- |
    | User mở 2 tab       | socket A, socket B            |
    | Socket A disconnect | ❌ không được set user offline |
    | Socket B vẫn sống   | ✅ user vẫn online             |
    */
    if (uid && onlineUsers.get(uid)?.socketId === socket.id) {
      onlineUsers.delete(uid)
      io.emit('users:presence', mergedList())
    }

    for (const [cid, c] of activeCall.entries()) {
      if (c.status === 'ringing' && (c.fromUserId === uid || c.toUserId === uid)) {
        const otherUserId = c.fromUserId === uid ? c.toUserId : c.fromUserId

        const otherSocketId = onlineUsers.get(otherUserId)?.socketId

        if (otherSocketId) {
          io.to(otherSocketId).emit('call:cancelled', {
            callId: cid
          })
        }

        activeCall.delete(cid)
      }
    }
  })
}

/*
const activeCall = new Map()

activeCall = Map {
  "c1a2" => {
    fromUserId: "u1",
    toUserId: "u2",
    status: "ringing"
  },
  "d9f8" => {
    fromUserId: "u3",
    toUserId: "u4",
    status: "accepted",
    roomId: "abcd1234"
  }
}
key = callId
value = thông tin cuộc gọi

activeCall.entries() => [key, value]
VD:
[
    ["c1a2", { fromUserId: "u1", toUserId: "u2", status: "ringing" }],
    ["d9f8", { fromUserId: "u3", toUserId: "u4", status: "accepted", roomId: "abcd1234" }]
]


for (const [cid, c] of activeCall.entries()) === 
for (const entry of activeCall.entries()) {
    const cid = entry[0]
    const c = entry[1]
}
VD: 
cid = "c1a2"
c = {
  fromUserId: "u1",
  toUserId: "u2",
  status: "ringing"
}



*/

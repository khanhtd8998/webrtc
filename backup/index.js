socket.on('room:join', ({ roomId, user }) => {
  if (!roomId || !user?.idUser) return

  const room = rooms.get(roomId)
  if (!room) {
    socket.emit('room:error', 'Room not found')
    return
  }

  // ===============================
  // REJOIN SAFE:
  // If same idUser exists (refresh/reconnect), update socketId and re-join.
  // ===============================
  const existing = room.participants.find((p) => p.idUser === user.idUser)

  if (existing) {
    existing.socketId = socket.id
    existing.username = user.username ?? existing.username

    socket.join(roomId)
    joinedRooms.add(roomId)

    logRoomJson(room, 'AFTER ROOM:REJOIN (UPDATE SOCKET)')

    // If room currently has 2 participants, re-emit ready
    // (helps restore WebRTC after refresh)
    if (room.participants.length === 2) {
      const ownerStillHere = room.participants.some((p) => p.idUser === room.idOwner)

      if (!ownerStillHere) {
        socket.emit('room:error', 'Owner is missing')
        return
      }

      io.to(roomId).emit('room:ready', {
        roomId,
        ownerId: room.idOwner,
        participants: room.participants
      })

      console.log('🟢 Room ready (rejoin):', roomId)
    }

    return
  }

  // ===============================
  // Max 2 users (apply only for NEW user)
  // ===============================
  if (room.participants.length >= 2) {
    socket.emit('room:error', 'Room is full')
    return
  }

  // ===============================
  // Add new participant
  // ===============================
  room.participants.push({
    idUser: user.idUser,
    username: user.username,
    socketId: socket.id
  })

  socket.join(roomId)
  joinedRooms.add(roomId)

  logRoomJson(room, 'AFTER ROOM:JOIN (NEW USER)')
  console.log('👤 User joined room:', roomId, user.idUser)

  // ===============================
  // When 2 participants -> ready for WebRTC
  // ===============================
  if (room.participants.length === 2) {
    const ownerStillHere = room.participants.some((p) => p.idUser === room.idOwner)

    if (!ownerStillHere) {
      socket.emit('room:error', 'Owner is missing')
      return
    }

    io.to(roomId).emit('room:ready', {
      roomId,
      ownerId: room.idOwner,
      participants: room.participants
    })

    console.log('🟢 Room ready:', roomId)
  }
})

socket.on('room:ready', async ({ ownerId }) => {
  const isOwner = ownerId === currentUser.idUser
  if (!isOwner) return

  const pc = ensurePeerConnection()

  if (pc.signalingState !== 'stable') return

  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)

  socket.emit('webrtc:offer', { roomId, offer })
})

socket.on('webrtc:offer', async (offer) => {
  const pc = ensurePeerConnection()

  await pc.setRemoteDescription(offer)

  const answer = await pc.createAnswer()
  await pc.setLocalDescription(answer)

  socket.emit('webrtc:answer', { roomId, answer })
})

socket.on('webrtc:answer', async (answer) => {
  const pc = ensurePeerConnection()
  await pc.setRemoteDescription(answer)
})


socket.on("room:ready", async ({ ownerId }) => {
  if (ownerId !== currentUser.idUser) return

  const pc = ensurePeerConnection()

  if (pc.signalingState !== "stable") {
    console.warn("Skip createOffer: signalingState =", pc.signalingState)
    return
  }

  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)

  socket.emit("webrtc:offer", { roomId, offer })
})


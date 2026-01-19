const isOwnerRef = useRef(false)

useEffect(() => {
  if (!roomId || !localStream || localStream.getTracks().length === 0) return

  const pc = ensurePeerConnection()


  /* ================= NEGOTIATION NEEDED ================= */
  pc.onnegotiationneeded = async () => {
    // chỉ renegotiate khi ổn định
    if (pc.signalingState !== 'stable') return

    // chỉ OWNER mới được phép createOffer
    if (!isOwnerRef.current) return

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    socket.emit('webrtc:offer', { roomId, offer })
  }

  /* ================= ROOM READY ================= */
  socket.on('room:ready', async ({ ownerId }) => {
    const isOwner = ownerId === idUser
    isOwnerRef.current = isOwner

    if (!isOwner) return

    const pc = ensurePeerConnection()
    if (pc.signalingState !== 'stable') return

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    socket.emit('webrtc:offer', { roomId, offer })
  })

  /* ================= RECEIVE OFFER ================= */
  socket.on('webrtc:offer', async ({ offer }) => {
    if (pc.signalingState !== 'stable') return

    await pc.setRemoteDescription(offer)

    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    socket.emit('webrtc:answer', { roomId, answer })
    setRemoteState('connected')
  })

  /* ================= RECEIVE ANSWER ================= */
  socket.on('webrtc:answer', async ({ answer }) => {
    if (pc.signalingState !== 'have-local-offer') return

    await pc.setRemoteDescription(answer)
    setRemoteState('connected')
  })

  /* ================= ICE ================= */
  socket.on('webrtc:ice', async ({ candidate }) => {
    await pc.addIceCandidate(candidate)
  })

  socket.on('webrtc:peer-left', cleanup)

  return () => {
    cleanup()
    socket.off('room:ready')
    socket.off('webrtc:offer')
    socket.off('webrtc:answer')
    socket.off('webrtc:ice')
    socket.off('webrtc:peer-left')
  }
}, [roomId, localStream])

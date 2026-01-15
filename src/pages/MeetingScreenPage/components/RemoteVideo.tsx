import { useEffect, useRef } from 'react'

export const RemoteVideo = ({
  remoteVideoRef,
  displayName
}: {
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>
  displayName?: string
}) => {

  return (
    <>
      <div className='relative w-full h-120 rounded-md overflow-hidden bg-black'>
        <video ref={remoteVideoRef} autoPlay playsInline className='w-full h-full object-cover' />
        {displayName && (
          <div className='absolute left-2 bottom-2 bg-black/60 text-white text-sm px-2 py-1 rounded'>{displayName}</div>
        )}
      </div>
    </>
  )
}

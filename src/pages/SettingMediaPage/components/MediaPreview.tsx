// components/MediaPreview.tsx

import type { RefObject } from "react"

type MediaPreviewProps = {
  videoRef: RefObject<HTMLVideoElement | null>
}

export const MediaPreview = ({
  videoRef
}: MediaPreviewProps) => {
  return (
    <div>
      <video
        ref={videoRef}
        className="w-full h-120 object-cover rounded-md bg-[#ccc]"
        autoPlay
        playsInline
      />
    </div>
  )
}
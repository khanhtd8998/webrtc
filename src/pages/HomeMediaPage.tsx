import { Button, Input, Spin } from 'antd'
import { Mic, Video } from 'lucide-react'
import { useMediaStore } from '../store/MediaStore'
import { useEffect, useRef, useState } from 'react'

const HomeMediaPage = () => {
  const [loading, setLoading] = useState(true)
  const localCameraRef = useRef<HTMLVideoElement>(null)

  // const data = localStorage.getItem('media-store')
  // const username = data ? JSON.parse(data)?.state?.username : undefined
  // const devicesSetting = data ? JSON.parse(data)?.state?.devicesSetting : undefined
  const username = useMediaStore((s) => s.username)
  const devicesSetting = useMediaStore((s) => s.devicesSetting)

  useEffect(() => {
    init()

    return () => {
      const video = localCameraRef.current
      if (video?.srcObject) (video.srcObject as MediaStream).getTracks().forEach((track) => track.stop())
    }
  }, [])
  const init = async () => {
    try {
      setLoading(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: devicesSetting?.microphone ? { deviceId: devicesSetting.microphone } : true,
        video: devicesSetting?.camera ? { deviceId: devicesSetting.camera } : true
      })
      if (localCameraRef.current) {
        localCameraRef.current.srcObject = stream
        localCameraRef.current.onloadedmetadata = () => {
          localCameraRef.current?.play()
          setLoading(false)
        }
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <>
      <div className='max-w-4xl mx-auto p-4'>
        <h1 className='font-semibold'>Hi, {username}</h1>
        <div className='mt-16 flex items-center gap-4'>
          <Input id='link-meeting' placeholder='Enter link Meeting' />
          <Button type='primary'>Join</Button>
          <Button type='primary'>Create Meeting</Button>
        </div>
        <div className='mt-16'>
          {loading && (
            <div className='absolute inset-0 flex items-center justify-center z-10 w-full h-screen bg-white/70'>
              <Spin size='large' />
            </div>
          )}
          <video
            ref={localCameraRef}
            className='w-full h-150 object-cover rounded-md bg-[#ccc]'
            autoPlay
            playsInline
          ></video>
          <div className='flex justify-center mt-4 gap-4'>
            <Button shape='circle' size='large'>
              <Mic />
            </Button>
            {devicesSetting?.camera && (
              <Button shape='circle' size='large'>
                <Video />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default HomeMediaPage

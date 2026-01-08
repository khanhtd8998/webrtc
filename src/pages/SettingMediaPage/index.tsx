// pages/SettingMediaPage.tsx
import { Form } from 'antd'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { LoadingOverlay } from '../../components/LoadingOverlay'
import { useMediaDevices } from '../../hooks/useMediaDevices'
import { useMediaStore } from '../../store/MediaStore'
import { MediaPreview } from './components/MediaPreview'
import { MediaSettingsForm } from './components/MediaSettingsForm'

type FieldType = {
  username?: string
  microphone?: string
  camera?: string
  speaker?: string
}

const SettingMediaPage = () => {
  const devices = useMediaStore((s) => s.devices)
  const setDevices = useMediaStore((s) => s.setDevices)

  const nav = useNavigate()
  const [form] = Form.useForm()

  const localCameraRef = useRef<HTMLVideoElement>(null)

  const { microphones, cameras, speakers, isLoading } = useMediaDevices(localCameraRef)

  useEffect(() => {
    form?.setFieldsValue({
      username: devices.username,
      microphone: devices.microphoneId,
      camera: devices.cameraId,
      speaker: devices.speakerId
    })
  }, [devices])

  const onFinish = (values: FieldType) => {
    const { username, microphone, camera, speaker } = values

    if (username) setDevices('username', username)
    if (microphone) setDevices('microphoneId', microphone)
    if (camera) setDevices('cameraId', camera)
    if (speaker) setDevices('speakerId', speaker)
    form.resetFields()
    nav('/media')
  }
  return (
    <>
      {isLoading && <LoadingOverlay />}

      <div className='max-w-4xl mx-auto'>
        {/* <h1 className='font-semibold text-xl'>Setting</h1> */}
        <div className='mt-16'>
          <MediaSettingsForm
            form={form}
            microphones={microphones}
            cameras={cameras}
            speakers={speakers}
            onFinish={onFinish}
          />
          <MediaPreview videoRef={localCameraRef} />
        </div>
      </div>
    </>
  )
}

export default SettingMediaPage

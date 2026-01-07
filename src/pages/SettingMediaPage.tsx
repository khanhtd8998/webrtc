import type { FormProps } from 'antd'
import { Button, Form, Input, Select, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useMediaStore } from '../store/MediaStore'

type FieldType = {
  username?: string
  microphone?: string
  camera?: string
  speaker?: string
}

const SettingMediaPage = () => {
  const nav = useNavigate()
  const setUsername = useMediaStore((s) => s.setUsername)
  const setDevices = useMediaStore((s) => s.setDevices)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([])
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([])
  const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([])

  const [form] = Form.useForm()
  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    setIsLoading(true)
    const streams: MediaStream[] = []

    try {
      streams.push(await navigator.mediaDevices.getUserMedia({ audio: true }))
    } catch (e) {
      console.warn('No microphone permission')
    }

    try {
      streams.push(await navigator.mediaDevices.getUserMedia({ video: true }))
    } catch (e) {
      console.warn('No camera permission or device')
    }

    const devices = await navigator.mediaDevices.enumerateDevices()

    streams.forEach((stream) => stream.getTracks().forEach((track) => track.stop()))

    const mics = devices.filter((d) => d.kind === 'audioinput')
    const cams = devices.filter((d) => d.kind === 'videoinput')
    const outs = devices.filter((d) => d.kind === 'audiooutput')

    setMicrophones(mics)
    setCameras(cams)
    setSpeakers(outs)

    const micId = mics[0]?.deviceId
    const camId = cams[0]?.deviceId
    const speakerId = outs[0]?.deviceId

    form.setFieldsValue({
      microphone: micId,
      camera: camId,
      speaker: speakerId
    })
    setIsLoading(false)
  }

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    const { username, microphone, camera, speaker } = values
    console.log('setting devices', values)
    username && setUsername(username)
    microphone && setDevices('microphone', microphone)
    camera && setDevices('camera', camera)
    speaker && setDevices('speaker', speaker)

    nav('/media')
  }

  return (
    <>
      {isLoading ? (
        <div className='absolute inset-0 flex items-center justify-center z-10 w-full h-screen bg-white/70'>
          <Spin size='large' />
        </div>
      ) : (
        <div className='max-w-4xl mx-auto p-4'>
          <h1 className='font-semibold'>Setting</h1>
          <div className='mt-16'>
            <Form
              name='basic'
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 12 }}
              labelAlign='left'
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete='off'
              form={form}
            >
              <Form.Item<FieldType>
                rules={[{ required: true, message: 'Please input your username!' }]}
                label='Username'
                name='username'
              >
                <Input onChange={(e) => setUsername(e.target.value)} />
              </Form.Item>

              <Form.Item label='Microphone' name='microphone'>
                <Select
                  disabled={microphones.length === 0}
                  options={microphones.map((d) => ({
                    label: d.label,
                    value: d.deviceId
                  }))}
                  onChange={(value) => setDevices('microphone', value)}
                />
              </Form.Item>

              <Form.Item label='Camera' name='camera'>
                <Select
                  disabled={cameras.length === 0}
                  options={cameras.map((d) => ({
                    label: d.label,
                    value: d.deviceId
                  }))}
                  onChange={(value) => setDevices('camera', value)}
                />
              </Form.Item>

              <Form.Item label='Speaker' name='speaker'>
                <Select
                  disabled={speakers.length === 0}
                  options={speakers.map((d) => ({
                    label: d.label,
                    value: d.deviceId
                  }))}
                  onChange={(value) => setDevices('speaker', value)}
                />
              </Form.Item>

              <Form.Item className='text-end' label={null}>
                <Button type='primary' htmlType='submit'>
                  Next
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    </>
  )
}

export default SettingMediaPage

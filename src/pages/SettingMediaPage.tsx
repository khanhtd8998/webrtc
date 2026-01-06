import type { FormProps } from 'antd'
import { Button, Form, Input, Select } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useMediaStore } from '../store/MediaStore'

type FieldType = {
  username?: string
  microphone?: string
  camera?: string
  speaker?: string
}

type Option = {
  label: string
  value: string
}

const SettingMediaPage = () => {
  const nav = useNavigate()
  const [form] = Form.useForm()

  const setUsername = useMediaStore((s) => s.setUsername)
  const setDevice = useMediaStore((s) => s.setDevice)
  const devices = useMediaStore((s) => s.devices)

  const [microphones, setMicrophones] = useState<any[]>([])
  const [cameras, setCameras] = useState<any[]>([])
  const [speakers, setSpeakers] = useState<any[]>([])

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    let audioStream: MediaStream | null = null
    let videoStream: MediaStream | null = null

    try {
      // ✅ xin audio trước (gần như máy nào cũng có)
      audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true
      })
    } catch (e) {
      console.warn('No microphone permission')
    }

    try {
      videoStream = await navigator.mediaDevices.getUserMedia({
        video: true
      })
    } catch (e) {
      console.warn('No camera permission or device')
    }

    const devices = await navigator.mediaDevices.enumerateDevices()

    audioStream?.getTracks().forEach((t) => t.stop())
    videoStream?.getTracks().forEach((t) => t.stop())

    const mics = devices.filter((d) => d.kind === 'audioinput')
    const cams = devices.filter((d) => d.kind === 'videoinput')
    const outs = devices.filter((d) => d.kind === 'audiooutput')

    setMicrophones(mics)
    setCameras(cams)
    setSpeakers(outs)

    const micId = mics[0]?.deviceId
    const camId = cams[0]?.deviceId
    const speakerId = outs[0]?.deviceId

    if (micId) setDevice('microphoneId', micId)
    if (camId) setDevice('cameraId', camId)
    if (speakerId) setDevice('speakerId', speakerId)

    // 🔥 FILL FORM
    form.setFieldsValue({
      microphone: micId,
      camera: camId,
      speaker: speakerId
    })
  }

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log(values)
    if (values.username) setUsername(values.username)
    if (values.microphone) setDevice('microphoneId', values.microphone)
    if (values.camera) setDevice('cameraId', values.camera)
    if (values.speaker) setDevice('speakerId', values.speaker)
    nav('/media')
  }

  return (
    <>
      <div className='max-w-4xl mx-auto p-4'>
        <h1 className='font-semibold'>Setting Media</h1>
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
            <Form.Item<FieldType> label='Username' name='username'>
              <Input onChange={(e) => setUsername(e.target.value)} />
            </Form.Item>

            <Form.Item label='Microphone' name='microphone'>
              <Select
                options={microphones.map((d) => ({
                  label: d.label,
                  value: d.deviceId
                }))}
                onChange={(v) => setDevice('microphoneId', v)}
              />
            </Form.Item>

            <Form.Item label='Camera' name='camera'>
              <Select
                options={cameras.map((d) => ({
                  label: d.label,
                  value: d.deviceId
                }))}
                onChange={(v) => setDevice('cameraId', v)}
              />
            </Form.Item>

            <Form.Item label='Speaker' name='speaker'>
              <Select
                options={speakers.map((d) => ({
                  label: d.label,
                  value: d.deviceId
                }))}
                onChange={(v) => setDevice('speakerId', v)}
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
    </>
  )
}

export default SettingMediaPage

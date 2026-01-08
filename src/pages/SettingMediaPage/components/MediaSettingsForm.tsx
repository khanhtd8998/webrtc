// components/MediaSettingsForm.tsx
import { Button, Form, Input, Select } from 'antd'
import type { FormProps } from 'antd'
import { useMediaStore } from '../../../store/MediaStore'
import { useEffect } from 'react'

type FieldType = {
  username?: string
  microphone?: string
  camera?: string
  speaker?: string
}

type MediaSettingsFormProps = {
  form: FormProps['form']
  microphones: MediaDeviceInfo[]
  cameras: MediaDeviceInfo[]
  speakers: MediaDeviceInfo[]
  onFinish: (values: FieldType) => void
}

export const MediaSettingsForm = ({ form, microphones, cameras, speakers, onFinish }: MediaSettingsFormProps) => {
  const setDevices = useMediaStore((s) => s.setDevices)
  const devices = useMediaStore((s) => s.devices)



  return (
    <Form
      name='basic'
      labelCol={{ span: 4 }}
      //   wrapperCol={{ span: 16 }}
      labelAlign='left'
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete='off'
      form={form}
    >
      <Form.Item<FieldType>
        label='Username'
        name='username'
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input onChange={(value) => setDevices('username', value.target.value)} />
      </Form.Item>

      <Form.Item label='Microphone' name='microphone'>
        <Select
          disabled={microphones.length === 0}
          options={microphones.map((d) => ({
            label: d.label || 'Unknown Microphone',
            value: d.deviceId
          }))}
          onChange={(value) => setDevices('microphoneId', value)}
        />
      </Form.Item>

      <Form.Item label='Camera' name='camera'>
        <Select
          disabled={cameras.length === 0}
          options={cameras.map((d) => ({
            label: d.label || 'Unknown Camera',
            value: d.deviceId
          }))}
          onChange={(value) => setDevices('cameraId', value)}
        />
      </Form.Item>

      <Form.Item label='Speaker' name='speaker'>
        <Select
          disabled={speakers.length === 0}
          options={speakers.map((d) => ({
            label: d.label || 'Unknown Speaker',
            value: d.deviceId
          }))}
          onChange={(value) => setDevices('speakerId', value)}
        />
      </Form.Item>

      <Form.Item className='text-end' label={null}>
        <Button type='primary' htmlType='submit'>
          Next
        </Button>
      </Form.Item>
    </Form>
  )
}

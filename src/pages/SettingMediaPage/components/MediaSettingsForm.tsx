// components/MediaSettingsForm.tsx
import { Button, Input } from 'antd'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mediaSettingsSchema, type MediaSettingsFormValues } from '../../../schema/mediaSetting.schema'
import { MediaDeviceSelectRHF } from '../../../components/MediaDeviceSelect '
import { useMediaStore } from '../../../store/MediaStore'
import { useNavigate } from 'react-router'
type Props = {
  microphones: MediaDeviceInfo[]
  cameras: MediaDeviceInfo[]
  speakers: MediaDeviceInfo[]
}
export const MediaSettingsForm = ({ microphones, cameras, speakers }: Props) => {
  const navigate = useNavigate()
  const form = useForm<MediaSettingsFormValues>({
    resolver: zodResolver(mediaSettingsSchema),
    defaultValues: {
      displayName: '',
      microphoneId: undefined,
      cameraId: undefined,
      speakerId: undefined
    }
  })
  
  const { control, setValue, handleSubmit } = form
  const devices = useMediaStore((state) => state.devices)
  const setDevies = useMediaStore((state) => state.setDevices)

  useEffect(() => {
    if (microphones.length > 0) {
      setValue('microphoneId', microphones[0].deviceId, { shouldDirty: false })
    }
  }, [microphones])
  useEffect(() => {
    if (cameras.length > 0) {
      setValue('cameraId', cameras[0].deviceId, { shouldDirty: false })
    }
  }, [cameras])
  useEffect(() => {
    if (speakers.length > 0) {
      setValue('speakerId', speakers[0].deviceId, { shouldDirty: false })
    }
  }, [speakers])

  const normalize = (v?: string) => (v === '' ? undefined : v)
  const onSubmit = (values: MediaSettingsFormValues) => {
    const payload = {
      ...values,
      microphoneId: normalize(values.microphoneId),
      cameraId: normalize(values.cameraId),
      speakerId: normalize(values.speakerId)
    }
    setDevies(payload)
    navigate('/precall')
  }
  useEffect(() => {
    console.log('devices changed:', devices)
  }, [devices])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='max-w-xl space-y-4'>
      <div>
        <label className='block mb-1 font-medium'>Display Name</label>
        <Controller
          name='displayName'
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Input {...field} />
              {fieldState.error && <p className='text-red-500 text-sm mt-1'>{fieldState.error.message}</p>}
            </>
          )}
        />
      </div>

      <MediaDeviceSelectRHF name='microphoneId' label='Select microphone' devices={microphones} control={control} />

      <MediaDeviceSelectRHF name='cameraId' label='Select camera' devices={cameras} control={control} />

      <MediaDeviceSelectRHF name='speakerId' label='Select speaker' devices={speakers} control={control} />

      <Button type='primary' htmlType='submit'>
        Submit
      </Button>
    </form>
  )
}

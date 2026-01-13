// components/MediaSettingsForm.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { mediaSettingsSchema, type MediaSettingsFormValues } from '../../../schema/mediaSetting.schema'
import { useMediaStore } from '../../../store/MediaStore'
import { MediaDeviceSelect } from './MediaDeviceSelect '
export const MediaSettingsForm = ({
  microphones,
  cameras,
  speakers
}: {
  microphones: MediaDeviceInfo[]
  cameras: MediaDeviceInfo[]
  speakers: MediaDeviceInfo[]
}) => {
  const setDevies = useMediaStore((state) => state.setDevices)
  const navigate = useNavigate()
  const errors = useMediaStore((s) => s.errors)

  const form = useForm<MediaSettingsFormValues>({
    resolver: zodResolver(mediaSettingsSchema),
    defaultValues: {
      displayName: '',
      microphoneId: microphones[0]?.deviceId,
      cameraId: cameras[0]?.deviceId,
      speakerId: speakers[0]?.deviceId
    }
  })

  const { control, setValue, handleSubmit } = form

  // useEffect(() => {
  //   if (microphones.length > 0) {
  //     setValue('microphoneId', microphones[0].deviceId, { shouldDirty: false })
  //   }
  // }, [microphones])
  // useEffect(() => {
  //   if (cameras.length > 0) {
  //     setValue('cameraId', cameras[0].deviceId, { shouldDirty: false })
  //   }
  // }, [cameras])
  // useEffect(() => {
  //   if (speakers.length > 0) {
  //     setValue('speakerId', speakers[0].deviceId, { shouldDirty: false })
  //   }
  // }, [speakers])

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 w-full'>
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

      <MediaDeviceSelect
        disabled={!!errors.audio}
        name='microphoneId'
        label='Select microphone'
        devices={microphones}
        control={control}
      />

      <MediaDeviceSelect
        disabled={!!errors.video}
        name='cameraId'
        label='Select camera'
        devices={cameras}
        control={control}
      />

      <MediaDeviceSelect
        disabled={!!errors.audio && !!errors.video}
        name='speakerId'
        label='Select speaker'
        devices={speakers}
        control={control}
      />

      <Button type='primary' htmlType='submit'>
        Submit
      </Button>
    </form>
  )
}

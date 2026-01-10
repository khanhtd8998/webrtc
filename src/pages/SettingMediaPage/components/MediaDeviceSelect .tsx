// components/MediaDeviceSelectRHF.tsx
import { Controller, type Control } from 'react-hook-form'
import { Select } from 'antd'
import { formatDeviceLabel } from '../../../ultils/media'
import type { MediaSettingsFormValues } from '../../../schema/mediaSetting.schema'
import { useMediaStore } from '../../../store/MediaStore'

type Props = {
  name: keyof MediaSettingsFormValues
  label: string
  devices: MediaDeviceInfo[]
  control: Control<MediaSettingsFormValues>
  disabled?: boolean
}

export const MediaDeviceSelectRHF = ({ name, label, devices, control, disabled }: Props) => {
  const setDevies = useMediaStore((state) => state.setDevices)
  return (
    <div className='mb-4'>
      <label className='block mb-1 font-medium'>{label}</label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            disabled={disabled}
            className='w-full'
            allowClear
            placeholder={label}
            options={devices.map((d) => ({
              value: d.deviceId,
              label: formatDeviceLabel(d.label)
            }))}
            onChange={(v) => {
              field.onChange(v ?? undefined)
              setDevies({ [name]: v })
            }}
          />
        )}
      />
    </div>
  )
}

// components/ToggleMediaButton.tsx
import { Button } from 'antd'
import type { ReactNode } from 'react'

type Props = {
  enabled: boolean
  onClick: () => void
  iconOn: ReactNode
  iconOff: ReactNode
  disabled?: boolean
}

export const ToggleMediaButton = ({ enabled, onClick, iconOn, iconOff, disabled = false }: Props) => {
  return (
    <Button shape='circle' size='large' danger={!enabled} disabled={disabled} onClick={onClick}>
      {enabled ? iconOn : iconOff}
    </Button>
  )
}

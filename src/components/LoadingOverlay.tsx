// components/LoadingOverlay.tsx
import { Spin } from 'antd'

export const LoadingOverlay = () => (
  <div className='absolute inset-0 flex items-center justify-center z-50 w-full h-screen bg-white/70'>
    <Spin size='large' />
  </div>
)

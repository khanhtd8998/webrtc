import { Navigate, Outlet } from 'react-router'
import { useMediaStore } from '../store/MediaStore'

const ProtectedLayout = () => {
  const {
    devices: { displayName }
  } = useMediaStore()

  if (!displayName || displayName.trim() === '') {
    return <Navigate to='/' replace />
  }

  return <Outlet />
}

export default ProtectedLayout

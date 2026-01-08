import { Navigate, Outlet } from 'react-router'
import { useMediaStore } from '../store/MediaStore'

const ProtectedLayout = () => {
  const { devices: { username } } = useMediaStore()

  if (!username || username.trim() === '') {
    return <Navigate to='/' replace />
  }

  return <Outlet />
}

export default ProtectedLayout

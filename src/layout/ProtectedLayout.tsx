import { Navigate, Outlet } from 'react-router'
import { useMediaStore } from '../store/MediaStore'

const ProtectedLayout = () => {
  // const {
  //   devices: { displayName, microphoneId, cameraId, speakerId }
  // } = useMediaStore()

  // if ((!displayName || displayName.trim() === '') || (!microphoneId && !cameraId && !speakerId)) {
  //   return <Navigate to='/' replace />
  // }

  return <Outlet />
}

export default ProtectedLayout

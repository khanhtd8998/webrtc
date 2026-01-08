import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import ProtectedLayout from './layout/ProtectedLayout'
import { MeetingScreenPage, PreCallPage, SettingMediaPage } from './pages'
import { useMediaDevices } from './hooks/useMediaDevices'
import { useMediaStore } from './store/MediaStore'
import { useEffect } from 'react'

/**
 * The main application component.
 * This component is the entry point for the application
 * and is responsible for rendering the entire application.
 */
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <SettingMediaPage />
    },
    {
      element: <ProtectedLayout />,
      children: [
        {
          path: '/media',
          element: <PreCallPage />
        },
        {
          path: '/meeting',
          element: <MeetingScreenPage />
        }
      ]
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App

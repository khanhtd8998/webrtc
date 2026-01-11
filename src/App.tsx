import { createBrowserRouter, RouterProvider } from 'react-router'
import './App.css'
import ProtectedLayout from './layout/ProtectedLayout'
import { MeetingScreenPage, PreCallPage, SettingMediaPage } from './pages'
import { useEffect } from 'react'

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
          path: '/precall',
          element: <PreCallPage />
        },
        {
          path: '/meeting/:roomId',
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

import { useEffect, useRef, useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import SettingMediaPage from './pages/SettingMediaPage'
import MeetingScreenPage from './pages/MeetingScreenPage'
import HomeMediaPage from './pages/HomeMediaPage'
import ProtectedLayout from './layout/ProtectedLayout'

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
          element: <HomeMediaPage />
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

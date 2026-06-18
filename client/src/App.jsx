import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AuthCallback from './pages/AuthCallback'
import EditorRoom from './pages/EditorRoom'
import NotFound from './pages/NotFound'            

import ProtectedRoute from './components/UI/ProtectedRoute'
import ErrorBoundary from './components/UI/ErrorBoundary'
import PageLoader from './components/UI/PageLoader'      

import useAuthStore from './store/authStore'

function App() {
  const { fetchUser } = useAuthStore()
  const [appLoading, setAppLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await fetchUser()
      setAppLoading(false)
    }
    init()
  }, [])

  if (appLoading) {
    return <PageLoader />
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              border: '1px solid #374151',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#f9fafb' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#f9fafb' },
            },
          }}
        />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/room/:roomId"
            element={
              <ProtectedRoute>
                <EditorRoom />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
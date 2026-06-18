import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const AuthCallback = () => {
  const navigate = useNavigate()
  const { fetchUser } = useAuthStore()

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search)

      const token = params.get('token')
      const error = params.get('error')

      if (error) {
        toast.error('Google login failed. Please try again.')
        navigate('/login')
        return
      }

      if (token) {
        localStorage.setItem('token', token)

        await fetchUser()
        
        toast.success('Welcome! Logged in with Google 🎉')
        navigate('/dashboard')
      } else {
        toast.error('Something went wrong. Please try again.')
        navigate('/login')
      }
    }

    handleCallback()
  }, []) 

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing Google Sign In...</p>
      </div>
    </div>
  )
}

export default AuthCallback
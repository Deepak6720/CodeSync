import axios from 'axios'
import toast from 'react-hot-toast'
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
})
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message

    if (status === 401) {
      localStorage.removeItem('token')
      toast.error('Session expired. Please log in again.')
      // Small delay so toast is visible before redirect
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
    }
    if (status === 429) {
      toast.error(message || 'Too many requests. Please slow down.')
    }
    if (status === 403) {
      toast.error(message || 'You are not authorized to do this.')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authAPI } from '../api/endpoints.js'
import useAuthStore from '../stores/authStore.js'

export default function useAuth() {
  const { user, accessToken, setAuth, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.accessToken)
      toast.success(`Welcome back, ${res.data.user.name}!`)
      navigate('/dashboard')
    },
    onError: (err) => {
      toast.error(err.message || 'Login failed')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSettled: () => {
      clearAuth()
      navigate('/login')
      toast.success('Logged out successfully')
    },
  })

  return {
    user,
    accessToken,
    isAuthenticated: !!accessToken && !!user,
    login:  loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn:  loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  }
}

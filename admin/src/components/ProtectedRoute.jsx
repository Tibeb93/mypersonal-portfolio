import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../stores/authStore.js'

export default function ProtectedRoute({ children }) {
  const { accessToken, user } = useAuthStore()
  const location = useLocation()

  if (!accessToken || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, token } = useSelector(s => s.auth)
  const location = useLocation()
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />
  if (roles.length && !roles.includes(user?.role)) return <Navigate to="/unauthorized" replace />
  return children
}

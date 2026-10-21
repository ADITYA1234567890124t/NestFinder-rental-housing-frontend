import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { normalizeRole } from '@/utils/roles'

export default function PrivateRoute({ children, roles = [] }) {
  const { user, token } = useSelector(s => s.auth)
  const location = useLocation()
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />
  if (roles.length && !roles.map(normalizeRole).includes(normalizeRole(user?.role))) return <Navigate to="/unauthorized" replace />
  return children
}

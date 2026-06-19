import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { normalizeRole } from '@/utils/roles'

export default function AdminRoute({ children }) {
  const { user, token } = useSelector(s => s.auth)
  if (!token) return <Navigate to="/login" replace />
  if (normalizeRole(user?.role) !== 'ADMIN') return <Navigate to="/unauthorized" replace />
  return children
}

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUnreadCount } from '@/redux/slices/chatSlice'
import AppRoutes from '@/routes/AppRoutes'

export default function App() {
  const dispatch = useDispatch()
  const { token } = useSelector(s => s.auth)

  // Poll unread message count every 30s when logged in
  useEffect(() => {
    if (!token) return
    dispatch(fetchUnreadCount())
    const interval = setInterval(() => dispatch(fetchUnreadCount()), 30000)
    return () => clearInterval(interval)
  }, [token, dispatch])

  return <AppRoutes />
}

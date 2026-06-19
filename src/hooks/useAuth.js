import { useSelector, useDispatch } from 'react-redux'
import { loginUser, registerUser, logoutUser } from '@/redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { dashboardPathForRole, normalizeRole } from '@/utils/roles'

export function useAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, token, loading, error } =
    useSelector(s => s.auth)

  const login = async (credentials) => {
    const result = await dispatch(loginUser(credentials))

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Welcome back!')

      navigate(dashboardPathForRole(result.payload.role))

      return true
    }

    toast.error(result.payload || 'Login failed')
    return false
  }

  const register = async (formData) => {
    const result = await dispatch(registerUser(formData))

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Account created!')

      navigate(dashboardPathForRole(result.payload.role))

      return true
    }

    toast.error(result.payload || 'Registration failed')
    return false
  }

  const logout = async () => {
    await dispatch(logoutUser())
    toast.success('Logged out')
    navigate('/')
  }

  const isRole = (role) => normalizeRole(user?.role) === normalizeRole(role)
  const canAccess = (roles) =>
    roles.map(normalizeRole).includes(normalizeRole(user?.role))

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isRole,
    canAccess,
    isAuthenticated: !!token,
  }
}

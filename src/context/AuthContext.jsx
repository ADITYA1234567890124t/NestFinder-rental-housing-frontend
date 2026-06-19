import { createContext, useContext } from 'react'
import { useSelector } from 'react-redux'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { user, token } = useSelector(s => s.auth)
  const isAuthenticated = !!token
  const isRole   = (role)  => user?.role === role
  const canAccess= (roles) => Array.isArray(roles) && roles.includes(user?.role)

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isRole, canAccess }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
export default AuthContext

import authApi from '@/api/authApi'
import { tokenHelper } from '@/utils/tokenHelper'

export const authService = {
  login: async (email, password) => {
    const { data } = await authApi.login({ email, password })
    const auth = data.data
    tokenHelper.setToken(auth.accessToken)
    tokenHelper.setRefreshToken(auth.refreshToken)
    tokenHelper.setUser({ id: auth.userId, email: auth.email, fullName: auth.fullName, role: auth.role })
    return auth
  },
  register: async (payload) => {
    const { data } = await authApi.register(payload)
    const auth = data.data
    tokenHelper.setToken(auth.accessToken)
    tokenHelper.setRefreshToken(auth.refreshToken)
    tokenHelper.setUser({ id: auth.userId, email: auth.email, fullName: auth.fullName, role: auth.role })
    return auth
  },
  logout: async () => {
    try { await authApi.logout() } catch {}
    tokenHelper.clearAll()
  },
}

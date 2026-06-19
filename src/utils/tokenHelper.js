const TOKEN_KEY   = 'rh_token'
const REFRESH_KEY = 'rh_refresh'
const USER_KEY    = 'rh_user'

export const tokenHelper = {
  getToken:         ()      => localStorage.getItem(TOKEN_KEY),
  setToken:         (t)     => localStorage.setItem(TOKEN_KEY, t),
  removeToken:      ()      => localStorage.removeItem(TOKEN_KEY),

  getRefreshToken:  ()      => localStorage.getItem(REFRESH_KEY),
  setRefreshToken:  (t)     => localStorage.setItem(REFRESH_KEY, t),
  removeRefreshToken:()     => localStorage.removeItem(REFRESH_KEY),

  getUser:          ()      => { try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null } },
  setUser:          (u)     => localStorage.setItem(USER_KEY, JSON.stringify(u)),
  removeUser:       ()      => localStorage.removeItem(USER_KEY),

  clearAll:         ()      => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(USER_KEY)
  },

  isLoggedIn:       ()      => !!localStorage.getItem(TOKEN_KEY),
}

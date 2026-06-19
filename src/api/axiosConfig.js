import axios from 'axios'
import { tokenHelper } from '@/utils/tokenHelper'
import { store } from '@/redux/store'
import { logoutUser } from '@/redux/slices/authSlice'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
const baseURL = apiBaseUrl
  ? `${apiBaseUrl}${apiBaseUrl.endsWith('/api') ? '' : '/api'}`
  : '/api'

const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type':
      'application/json',
  },
})

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = tokenHelper.getToken()

    config.headers = config.headers || {}

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error.config

    if (
      (error.response?.status === 401 ||
        error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const refreshToken =
          tokenHelper.getRefreshToken()

        if (
          !refreshToken
        ) {
          throw new Error(
            'No refresh token'
          )
        }

        const response =
          await axios.post(
            `${baseURL}/auth/refresh`,
            null,
            {
              headers: {
                'Refresh-Token':
                  refreshToken,
              },
            }
          )

        const newToken =
          response.data.data
            .accessToken

        tokenHelper.setToken(
          newToken
        )

        tokenHelper.setRefreshToken(
          response.data.data
            .refreshToken
        )

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`

        return api(
          originalRequest
        )
      } catch (err) {
        store.dispatch(
          logoutUser()
        )

        window.location.href =
          '/login'

        return Promise.reject(
          err
        )
      }
    }

    return Promise.reject(
      error
    )
  }
)

export default api

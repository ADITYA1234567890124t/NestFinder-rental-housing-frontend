import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authApi from '@/api/authApi'
import { tokenHelper } from '@/utils/tokenHelper'
import { normalizeRole } from '@/utils/roles'

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials)

      // Backend response:
      // { success, message, data }
      return response.data.data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Login failed'
      )
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(formData)

      // Backend response:
      // { success, message, data }
      return response.data.data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          'Registration failed'
      )
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await authApi.logout()
    } catch (e) {
      console.log('Logout API failed')
    }

    tokenHelper.clearAll()
  }
)

export const refreshAccessToken =
  createAsyncThunk(
    'auth/refresh',
    async (_, { rejectWithValue }) => {
      try {
        const refreshToken =
          tokenHelper.getRefreshToken()

        const response =
          await authApi.refreshToken(
            refreshToken
          )

        return response.data.data
      } catch (err) {
        return rejectWithValue(
          err.response?.data?.message ||
            'Token refresh failed'
        )
      }
    }
  )

const storedUser = tokenHelper.getUser()
const storedToken = tokenHelper.getToken()
if (storedUser?.role) storedUser.role = normalizeRole(storedUser.role)

const authSlice = createSlice({
  name: 'auth',

  initialState: {
    user: storedUser,
    token: storedToken,
    loading: false,
    error: null,
  },

  reducers: {
    clearError: (state) => {
      state.error = null
    },

    setUser: (state, action) => {
      state.user = action.payload
      tokenHelper.setUser(action.payload)
    },
  },

  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true
      state.error = null
    }

    const rejected = (state, action) => {
      state.loading = false
      state.error = action.payload
    }

    builder
      // LOGIN
      .addCase(loginUser.pending, pending)

      .addCase(
        loginUser.fulfilled,
        (state, { payload }) => {
          state.loading = false

          state.token =
            payload.accessToken

          state.user = {
            id: payload.userId,
            email: payload.email,
            fullName:
              payload.fullName,
            role: normalizeRole(payload.role),
          }

          tokenHelper.setToken(
            payload.accessToken
          )

          tokenHelper.setRefreshToken(
            payload.refreshToken
          )

          tokenHelper.setUser(
            state.user
          )
        }
      )

      .addCase(
        loginUser.rejected,
        rejected
      )

      // REGISTER
      .addCase(
        registerUser.pending,
        pending
      )

      .addCase(
        registerUser.fulfilled,
        (state, { payload }) => {
          state.loading = false

          state.token =
            payload.accessToken

          state.user = {
            id: payload.userId,
            email: payload.email,
            fullName:
              payload.fullName,
            role: normalizeRole(payload.role),
          }

          tokenHelper.setToken(
            payload.accessToken
          )

          tokenHelper.setRefreshToken(
            payload.refreshToken
          )

          tokenHelper.setUser(
            state.user
          )
        }
      )

      .addCase(
        registerUser.rejected,
        rejected
      )

      // LOGOUT
      .addCase(
        logoutUser.fulfilled,
        (state) => {
          state.user = null
          state.token = null
        }
      )

      // REFRESH TOKEN
      .addCase(
        refreshAccessToken.fulfilled,
        (state, { payload }) => {
          state.token =
            payload.accessToken

          tokenHelper.setToken(
            payload.accessToken
          )

          tokenHelper.setRefreshToken(
            payload.refreshToken
          )
        }
      )
  },
})

export const {
  clearError,
  setUser,
} = authSlice.actions

export default authSlice.reducer

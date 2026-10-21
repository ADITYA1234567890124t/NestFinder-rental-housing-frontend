import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/api/axiosConfig'
import { tokenHelper } from '@/utils/tokenHelper'
import { setUser } from './authSlice'

export const fetchProfile    = createAsyncThunk('profile/fetch',    async (_, { rejectWithValue })        => { try { const { data } = await api.get('/users/me');                                         return data.data } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const updateProfile   = createAsyncThunk('profile/update',   async (payload, { dispatch, rejectWithValue }) => { try { const { data } = await api.put('/users/me', payload);                       dispatch(setUser(data.data)); tokenHelper.setUser(data.data); return data.data } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const uploadAvatar    = createAsyncThunk('profile/avatar',   async (formData, { rejectWithValue }) => { try { const { data } = await api.post('/users/me/profile-image', formData, { headers: { 'Content-Type':'multipart/form-data' } }); return data.data } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const changePassword  = createAsyncThunk('profile/password', async (payload, { rejectWithValue }) => { try { await api.put('/users/me/change-password', payload) }                                  catch (e) { return rejectWithValue(e.response?.data?.message) } })

const profileSlice = createSlice({
  name: 'profile',
  initialState: { profile: null, loading: false, error: null, success: false },
  reducers: { clearStatus: (s) => { s.error = null; s.success = false } },
  extraReducers: (b) => {
    const p = (s) => { s.loading = true; s.error = null; s.success = false }
    const r = (s, a) => { s.loading = false; s.error = a.payload }
    b
      .addCase(fetchProfile.pending,   p)
      .addCase(fetchProfile.fulfilled, (s, { payload }) => { s.loading = false; s.profile = payload })
      .addCase(fetchProfile.rejected,  r)
      .addCase(updateProfile.pending,   p)
      .addCase(updateProfile.fulfilled, (s, { payload }) => { s.loading = false; s.profile = payload; s.success = true })
      .addCase(updateProfile.rejected,  r)
      .addCase(uploadAvatar.fulfilled,  (s, { payload }) => { s.profile = payload })
      .addCase(changePassword.pending,  p)
      .addCase(changePassword.fulfilled,(s) => { s.loading = false; s.success = true })
      .addCase(changePassword.rejected, r)
  },
})
export const { clearStatus } = profileSlice.actions
export default profileSlice.reducer

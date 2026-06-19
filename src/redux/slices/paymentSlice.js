import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import paymentApi from '@/api/paymentApi'

const pageItems = (payload) => Array.isArray(payload) ? payload : payload?.content || []
const pageTotal = (payload) => Array.isArray(payload) ? 1 : payload?.totalPages || 0

export const initiatePayment = createAsyncThunk('payment/initiate', async (data, { rejectWithValue }) => { try { const r = await paymentApi.initiate(data);  return r.data.data } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const confirmPayment  = createAsyncThunk('payment/confirm',  async (data, { rejectWithValue }) => { try { const r = await paymentApi.confirm(data);  return r.data.data } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const fetchMyPayments = createAsyncThunk('payment/fetchMine',async (params, { rejectWithValue }) => { try { const r = await paymentApi.getMyPayments(params); return r.data.data } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const fetchEarnings   = createAsyncThunk('payment/earnings',  async (_, { rejectWithValue })    => { try { const r = await paymentApi.getEarnings();   return r.data.data } catch (e) { return rejectWithValue(e.response?.data?.message) } })

const paymentSlice = createSlice({
  name: 'payment',
  initialState: { payments: [], earnings: 0, loading: false, error: null, totalPages: 0 },
  reducers: { clearError: (s) => { s.error = null } },
  extraReducers: (b) => {
    b
      .addCase(initiatePayment.pending,  (s) => { s.loading = true })
      .addCase(initiatePayment.fulfilled,(s, { payload }) => { s.loading = false; s.payments.unshift(payload) })
      .addCase(initiatePayment.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(confirmPayment.pending,  (s) => { s.loading = true })
      .addCase(confirmPayment.fulfilled,(s, { payload }) => { s.loading = false; s.payments = s.payments.map(p => p.id === payload.id ? payload : p) })
      .addCase(confirmPayment.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(fetchMyPayments.pending,  (s) => { s.loading = true })
      .addCase(fetchMyPayments.fulfilled,(s, { payload }) => { s.loading = false; s.payments = pageItems(payload); s.totalPages = pageTotal(payload) })
      .addCase(fetchMyPayments.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(fetchEarnings.fulfilled,  (s, { payload }) => { s.earnings = payload })
  },
})
export const { clearError: clearPaymentError } = paymentSlice.actions
export default paymentSlice.reducer

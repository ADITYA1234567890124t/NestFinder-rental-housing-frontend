import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import paymentApi from '@/api/paymentApi'
import { normalizePaymentStatus } from '@/utils/constants'

const pageItems = (payload) => {
  if (Array.isArray(payload)) return payload
  return payload?.content || payload?.items || payload?.payments || payload?.records || payload?.results || []
}
const pageTotal = (payload) => Array.isArray(payload) ? 1 : payload?.totalPages || 0
const responseData = (response) => response?.data?.data ?? response?.data ?? response
const normalizePayment = (payment) => payment && ({
  ...payment,
  status: normalizePaymentStatus(payment.status ?? payment.paymentStatus),
})
const earningsAmount = (payload) => {
  const value = typeof payload === 'object' && payload !== null
    ? payload.totalEarnings ?? payload.earnings ?? payload.totalAmount ?? payload.amount ?? payload.total
    : payload
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : 0
}

export const initiatePayment = createAsyncThunk('payment/initiate', async (data, { rejectWithValue }) => { try { const r = await paymentApi.initiate(data); return normalizePayment(responseData(r)) } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const confirmPayment  = createAsyncThunk('payment/confirm',  async (data, { rejectWithValue }) => { try { const r = await paymentApi.confirm(data); return normalizePayment(responseData(r)) } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const fetchMyPayments = createAsyncThunk('payment/fetchMine',async (params, { rejectWithValue }) => { try { const r = await paymentApi.getMyPayments(params); return responseData(r) } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const fetchEarnings   = createAsyncThunk('payment/earnings',  async (_, { rejectWithValue })    => { try { const r = await paymentApi.getEarnings(); return earningsAmount(responseData(r)) } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const fetchOwnerPaymentHistory = createAsyncThunk('payment/ownerHistory', async (bookings = [], { rejectWithValue }) => {
  try {
    try {
      const ownerResponse = await paymentApi.getMyPayments({ page: 0, size: 100 })
      const ownerPayments = pageItems(responseData(ownerResponse)).map(normalizePayment)
      const bookingById = new Map(bookings.map((booking) => [String(booking.id), booking]))

      if (ownerPayments.length) {
        return ownerPayments.map((payment) => {
          const booking = bookingById.get(String(payment.bookingId))
          return {
            ...payment,
            booking,
            tenant: payment.tenant || booking?.tenant,
          }
        })
      }
    } catch {
      // Fall back to loading payments by each received booking.
    }

    const results = await Promise.allSettled(bookings.map(async (booking) => {
      const response = await paymentApi.getBookingPayments(booking.id, { page: 0, size: 100 })
      return pageItems(responseData(response)).map((payment) => ({
        ...normalizePayment(payment),
        booking,
        tenant: payment.tenant || booking.tenant,
      }))
    }))

    const payments = results
      .filter((result) => result.status === 'fulfilled')
      .flatMap((result) => result.value)

    return payments
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Failed to load tenant payment history')
  }
})

const paymentSlice = createSlice({
  name: 'payment',
  initialState: { payments: [], ownerPayments: [], earnings: 0, loading: false, error: null, totalPages: 0, ownerLoading: false },
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
      .addCase(fetchMyPayments.fulfilled,(s, { payload }) => { s.loading = false; s.payments = pageItems(payload).map(normalizePayment); s.totalPages = pageTotal(payload) })
      .addCase(fetchMyPayments.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(fetchEarnings.fulfilled,  (s, { payload }) => { s.earnings = payload })
      .addCase(fetchOwnerPaymentHistory.pending, (s) => { s.ownerLoading = true; s.error = null })
      .addCase(fetchOwnerPaymentHistory.fulfilled, (s, { payload }) => { s.ownerLoading = false; s.ownerPayments = payload })
      .addCase(fetchOwnerPaymentHistory.rejected, (s, a) => { s.ownerLoading = false; s.error = a.payload })
  },
})
export const { clearError: clearPaymentError } = paymentSlice.actions
export default paymentSlice.reducer

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import bookingApi from '@/api/bookingApi'
import propertyApi from '@/api/propertyApi'

const responseData = (response) => {
  const body = response?.data ?? response
  return body?.data?.data ?? body?.data ?? body
}
const pageItems = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.content)) return payload.content
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.bookings)) return payload.bookings
  if (Array.isArray(payload?.records)) return payload.records
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.list)) return payload.list
  return []
}
const pageTotal = (payload) => Array.isArray(payload) ? 1 : payload?.totalPages || payload?.pages || 0
const BOOKING_CACHE_KEY = 'rh_recent_bookings'

const readCachedBookings = () => {
  try {
    return JSON.parse(localStorage.getItem(BOOKING_CACHE_KEY)) || []
  } catch {
    return []
  }
}

const writeCachedBookings = (bookings) => {
  try {
    localStorage.setItem(BOOKING_CACHE_KEY, JSON.stringify(bookings.slice(0, 50)))
  } catch {
    // Local storage is only a fallback for development/demo flows.
  }
}

const cacheBooking = (booking) => {
  if (!booking?.id) return
  const next = [booking, ...readCachedBookings().filter((item) => item.id !== booking.id)]
  writeCachedBookings(next)
}

const mergeUniqueBookings = (...groups) => {
  const map = new Map()
  groups.flat().filter(Boolean).forEach((booking) => {
    if (booking?.id) map.set(booking.id, booking)
  })
  return Array.from(map.values())
}

const sameId = (a, b) => a != null && b != null && String(a) === String(b)
const bookingPropertyId = (booking) => booking?.property?.id ?? booking?.propertyId
const bookingOwnerId = (booking) => (
  booking?.property?.owner?.id ??
  booking?.property?.ownerId ??
  booking?.propertyOwnerId ??
  booking?.owner?.id ??
  booking?.ownerId
)

const cachedBookingsForOwner = (ownerId) => (
  readCachedBookings().filter((booking) => sameId(bookingOwnerId(booking), ownerId))
)

const ownerBookingsFromProperties = async (ownerId) => {
  const propertiesResponse = await propertyApi.getByOwner(ownerId, { page: 0, size: 100 })
  const properties = pageItems(responseData(propertiesResponse))
  const propertyIds = new Set(properties.map((property) => property.id))
  const propertyById = new Map(properties.map((property) => [property.id, property]))

  const propertyBookings = await Promise.all(
    properties.map(async (property) => {
      try {
        const response = await bookingApi.getByProperty(property.id, { page: 0, size: 100 })
        return pageItems(responseData(response)).map((booking) => ({
          ...booking,
          property: booking.property ?? property,
          propertyId: booking.propertyId ?? property.id,
        }))
      } catch {
        return []
      }
    })
  )

  const cached = readCachedBookings()
    .filter((booking) => propertyIds.has(Number(bookingPropertyId(booking))) || propertyIds.has(bookingPropertyId(booking)))
    .map((booking) => ({
      ...booking,
      property: booking.property ?? propertyById.get(booking.propertyId),
    }))

  return mergeUniqueBookings(propertyBookings.flat(), cached)
}

export const createBooking      = createAsyncThunk('booking/create',      async (data, { rejectWithValue, getState })         => {
  try {
    const r = await bookingApi.create(data)
    const user = getState().auth.user
    let property = responseData(r)?.property

    if (!property && data.propertyId) {
      try {
        const propertyResponse = await propertyApi.getById(data.propertyId)
        property = responseData(propertyResponse)
      } catch {
        property = null
      }
    }

    const booking = {
      ...responseData(r),
      propertyId: responseData(r)?.propertyId ?? data.propertyId,
      property,
      propertyOwnerId: responseData(r)?.propertyOwnerId ?? property?.owner?.id ?? property?.ownerId,
      tenantId: responseData(r)?.tenantId ?? user?.id,
      tenant: responseData(r)?.tenant ?? user,
    }
    cacheBooking(booking)
    return booking
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Booking failed')
  }
})
export const fetchMyBookings    = createAsyncThunk('booking/fetchMine',   async (params, { rejectWithValue })        => {
  const { tenantId, ...apiParams } = params || {}
  try {
    const r = await bookingApi.getMyBookings(apiParams)
    return responseData(r)
  } catch (e) {
    const cached = readCachedBookings().filter((booking) => !tenantId || booking.tenant?.id === tenantId || booking.tenantId === tenantId)
    if (cached.length) return { content: cached, totalPages: 1 }
    try {
      const r = await bookingApi.getAll(apiParams)
      return responseData(r)
    } catch {
      return rejectWithValue(e.response?.data?.message || 'Failed to load bookings')
    }
  }
})
export const fetchReceivedBookings = createAsyncThunk('booking/received', async (params, { rejectWithValue })        => {
  const { ownerId, ...apiParams } = params || {}
  let firstError = null

  try {
    const r = await bookingApi.getReceived(apiParams)
    const payload = responseData(r)
    const bookings = pageItems(payload)
    if (bookings.length) return payload
  } catch (e) {
    firstError = e
  }

  try {
    if (!ownerId) throw firstError || new Error('Owner not found')

    const cachedByOwner = cachedBookingsForOwner(ownerId)
    if (cachedByOwner.length) return { content: cachedByOwner, totalPages: 1 }

    const fallbackBookings = await ownerBookingsFromProperties(ownerId)
    if (fallbackBookings.length) return { content: fallbackBookings, totalPages: 1 }

    const allResponse = await bookingApi.getAll({ page: 0, size: 100 })
    const allBookings = pageItems(responseData(allResponse)).filter((booking) => sameId(bookingOwnerId(booking), ownerId))
    return { content: allBookings, totalPages: 1 }
  } catch {
    if (!firstError) {
      return { content: [], totalPages: 0 }
    }
    return rejectWithValue(firstError.response?.data?.message || 'Failed to load received bookings')
  }
})
export const updateBookingStatus= createAsyncThunk('booking/updateStatus',async ({ id, data }, { rejectWithValue }) => { try { const r = await bookingApi.updateStatus(id, data); return responseData(r) } catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to update booking') } })
export const cancelBooking      = createAsyncThunk('booking/cancel',      async (id, { rejectWithValue })            => { try { await bookingApi.cancel(id); return id }           catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to cancel booking') } })

const bookingSlice = createSlice({
  name: 'booking',
  initialState: { myBookings: [], receivedBookings: [], loading: false, error: null, totalPages: 0 },
  reducers: { clearError: (s) => { s.error = null } },
  extraReducers: (b) => {
    const p = (s) => { s.loading = true;  s.error = null }
    const r = (s, a) => { s.loading = false; s.error = a.payload }
    b
      .addCase(fetchMyBookings.pending,       p)
      .addCase(fetchMyBookings.fulfilled,     (s, { payload }) => { s.loading = false; s.myBookings = pageItems(payload); s.totalPages = pageTotal(payload) })
      .addCase(fetchMyBookings.rejected,      r)
      .addCase(fetchReceivedBookings.pending,   p)
      .addCase(fetchReceivedBookings.fulfilled, (s, { payload }) => { s.loading = false; s.receivedBookings = pageItems(payload); s.totalPages = pageTotal(payload) })
      .addCase(fetchReceivedBookings.rejected,  r)
      .addCase(createBooking.fulfilled,       (s, { payload }) => { s.myBookings.unshift(payload) })
      .addCase(updateBookingStatus.fulfilled, (s, { payload }) => {
        s.receivedBookings = s.receivedBookings.map(b => b.id === payload.id ? payload : b)
        s.myBookings       = s.myBookings.map(b => b.id === payload.id ? payload : b)
      })
      .addCase(cancelBooking.fulfilled, (s, { payload }) => {
        const update = (arr) => arr.map(b => b.id === payload ? { ...b, status: 'CANCELLED' } : b)
        s.myBookings       = update(s.myBookings)
        s.receivedBookings = update(s.receivedBookings)
      })
  },
})
export const { clearError: clearBookingError } = bookingSlice.actions
export default bookingSlice.reducer

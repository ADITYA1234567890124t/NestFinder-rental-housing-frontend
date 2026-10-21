import { useDispatch, useSelector } from 'react-redux'
import { createBooking, fetchMyBookings, fetchReceivedBookings, updateBookingStatus, cancelBooking } from '@/redux/slices/bookingSlice'
import toast from 'react-hot-toast'

export function useBooking() {
  const dispatch = useDispatch()
  const { myBookings, receivedBookings, loading, error, totalPages } = useSelector(s => s.booking)

  const book = async (data) => {
    const r = await dispatch(createBooking(data))
    if (r.meta.requestStatus === 'fulfilled') { toast.success('Booking request sent!'); return r.payload }
    toast.error(r.payload || 'Booking failed'); return null
  }

  const getMine    = (p) => dispatch(fetchMyBookings(p))
  const getReceived= (p) => dispatch(fetchReceivedBookings(p))

  const updateStatus = async (id, status, ownerNotes) => {
    const r = await dispatch(updateBookingStatus({ id, data: { status, ownerNotes } }))
    if (r.meta.requestStatus === 'fulfilled') { toast.success(`Booking ${status.toLowerCase()}`); return true }
    toast.error(r.payload || 'Failed'); return false
  }

  const cancel = async (id) => {
    const r = await dispatch(cancelBooking(id))
    if (r.meta.requestStatus === 'fulfilled') { toast.success('Booking cancelled'); return true }
    toast.error(r.payload || 'Failed'); return false
  }

  return { myBookings, receivedBookings, loading, error, totalPages, book, getMine, getReceived, updateStatus, cancel }
}

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchMyBookings, fetchReceivedBookings, updateBookingStatus, cancelBooking } from '@/redux/slices/bookingSlice'
import BookingCard from '@/components/booking/BookingCard'
import Loader from '@/components/common/Loader'
import Pagination from '@/components/common/Pagination'
import Modal from '@/components/common/Modal'
import PaymentForm from '@/components/payment/PaymentForm'
import { CheckCircle2, XCircle, CreditCard, Calendar, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { normalizeRole } from '@/utils/roles'

export default function MyBookings() {
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const { myBookings, receivedBookings, loading, error, totalPages } = useSelector(s => s.booking)
  const [page, setPage] = useState(0)
  const [payBooking, setPayBooking] = useState(null)

  const isOwner = normalizeRole(user?.role) === 'OWNER'

  useEffect(() => {
    if (isOwner) dispatch(fetchReceivedBookings({ page, size: 10, ownerId: user?.id }))
    else dispatch(fetchMyBookings({ page, size: 10, tenantId: user?.id }))
  }, [dispatch, page, isOwner, user?.id])

  const bookings = isOwner ? receivedBookings : myBookings

  const handleStatus = async (id, status) => {
    const result = await dispatch(updateBookingStatus({ id, data: { status } }))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`Booking ${status.toLowerCase()}`)
      dispatch(fetchReceivedBookings({ page, size: 10, ownerId: user?.id }))
    } else {
      toast.error(result.payload || 'Failed to update booking')
    }
  }

  const handleCancel = async (id) => {
    const result = await dispatch(cancelBooking(id))
    if (result.meta.requestStatus === 'fulfilled') toast.success('Booking cancelled')
    else toast.error(result.payload || 'Failed to cancel booking')
  }

  const tenant = (booking) => booking?.tenant || booking?.user || booking?.bookedBy
  const tenantId = (booking) => tenant(booking)?.id ?? booking?.tenantId ?? booking?.userId ?? booking?.bookedById
  const tenantName = (booking) => tenant(booking)?.fullName || tenant(booking)?.name || booking?.tenantName || 'Tenant'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-stone-900">
            {isOwner ? 'Received Bookings' : 'My Bookings'}
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-stone-100 rounded-xl p-1">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
            <button key={s} className="btn btn-ghost btn-sm text-xs">
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? <Loader /> : bookings.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar className="w-12 h-12 text-stone-200 mx-auto mb-4" />
          <p className="text-stone-500 font-medium">No bookings yet</p>
          <p className="text-stone-400 text-sm mt-1">
            {isOwner ? 'Booking requests will appear here' : 'Browse properties to make your first booking'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              actions={
                <>
                  {/* Tenant actions */}
                  {!isOwner && booking.status === 'CONFIRMED' && (
                    <button
                      onClick={() => setPayBooking(booking)}
                      className="btn btn-primary btn-sm gap-1"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Pay Rent
                    </button>
                  )}
                  {!isOwner && ['PENDING', 'CONFIRMED'].includes(booking.status) && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="btn btn-sm gap-1 text-red-500 border border-red-100 hover:bg-red-50"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancel
                    </button>
                  )}

                  {/* Owner actions */}
                  {isOwner && tenantId(booking) && (
                    <Link
                      to={`/owner/messages?userId=${tenantId(booking)}&name=${encodeURIComponent(tenantName(booking))}`}
                      className="btn btn-outline btn-sm gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Chat
                    </Link>
                  )}
                  {isOwner && booking.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatus(booking.id, 'CONFIRMED')}
                        className="btn btn-success btn-sm gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleStatus(booking.id, 'REJECTED')}
                        className="btn btn-danger btn-sm gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  )}
                  {isOwner && booking.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleStatus(booking.id, 'COMPLETED')}
                      className="btn btn-success btn-sm gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                    </button>
                  )}
                </>
              }
            />
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Payment modal */}
      <Modal
        isOpen={!!payBooking}
        onClose={() => setPayBooking(null)}
        title="Pay Rent"
        size="sm"
      >
        {payBooking && (
          <PaymentForm
            bookingId={payBooking.id}
            amount={payBooking.property?.monthlyRent}
            onSuccess={() => setPayBooking(null)}
          />
        )}
      </Modal>
    </div>
  )
}

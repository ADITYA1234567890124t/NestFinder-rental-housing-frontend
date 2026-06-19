import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyPayments, fetchEarnings } from '@/redux/slices/paymentSlice'
import { fetchMyBookings } from '@/redux/slices/bookingSlice'
import PaymentHistory from '@/components/payment/PaymentHistory'
import PaymentForm from '@/components/payment/PaymentForm'
import Modal from '@/components/common/Modal'
import Loader from '@/components/common/Loader'
import Pagination from '@/components/common/Pagination'
import { formatCurrency } from '@/utils/formatCurrency'
import { CreditCard, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'

export default function PaymentPage() {
  const dispatch  = useDispatch()
  const { user }  = useSelector(s => s.auth)
  const { payments, earnings, loading, totalPages } = useSelector(s => s.payment)
  const { myBookings } = useSelector(s => s.booking)
  const [page, setPage]       = useState(0)
  const [payModal, setPayModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const isOwner = user?.role === 'OWNER'

  useEffect(() => {
    dispatch(fetchMyPayments({ page, size: 10 }))
    if (isOwner) dispatch(fetchEarnings())
    else dispatch(fetchMyBookings({ page: 0, size: 50 }))
  }, [dispatch, page, isOwner])

  const confirmedBookings = myBookings.filter(b => b.status === 'CONFIRMED')
  // Also allow payment for ACTIVE bookings if no CONFIRMED ones exist
  const payableBookings = confirmedBookings.length > 0 
    ? confirmedBookings 
    : myBookings.filter(b => ['ACTIVE', 'ONGOING'].includes(b.status))

  const openPayModal = (booking) => {
    setSelectedBooking(booking)
    setPayModal(true)
  }

  // Include COMPLETED, CONFIRMED, and PROCESSING statuses as paid
  const totalPaid   = payments.filter(p => ['COMPLETED', 'CONFIRMED', 'PROCESSING'].includes(p.status)).reduce((s, p) => s + p.amount, 0)
  // Only count PENDING and INITIATED as pending
  const totalPending= payments.filter(p => ['PENDING', 'INITIATED'].includes(p.status)).length

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-stone-900 mb-6">
        {isOwner ? 'Earnings' : 'Payments'}
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs text-stone-400">
              {isOwner ? 'Total Earnings' : 'Total Paid'}
            </p>
            <p className="text-xl font-semibold text-stone-900">
              {formatCurrency(isOwner ? earnings : totalPaid)}
            </p>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-stone-400">Pending Payments</p>
            <p className="text-xl font-semibold text-stone-900">{totalPending}</p>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <p className="text-xs text-stone-400">Total Transactions</p>
            <p className="text-xl font-semibold text-stone-900">{payments.length}</p>
          </div>
        </div>
      </div>

      {/* Pay rent for confirmed bookings (tenant only) */}
      {!isOwner && (
        <>
          {payableBookings.length > 0 ? (
            <div className="card p-5 mb-6">
              <h2 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-500" />
                Pending Rent Payments
              </h2>
              <div className="space-y-3">
                {payableBookings.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                    <div>
                      <p className="font-medium text-stone-900 text-sm">{b.property?.title}</p>
                      <p className="text-xs text-stone-500">{b.property?.city}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-primary-600">
                        {formatCurrency(b.property?.monthlyRent)}
                      </span>
                      <button onClick={() => openPayModal(b)} className="btn btn-primary btn-sm">
                        Pay Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card p-8 mb-6 text-center">
              <CreditCard className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-600 font-medium mb-2">No Active Rentals</p>
              <p className="text-sm text-stone-400">
                You don't have any active bookings yet. Book a property to start paying rent.
              </p>
            </div>
          )}
        </>
      )}

      {/* Payment history */}
      <div className="card p-5">
        <h2 className="font-semibold text-stone-900 mb-4">Transaction History</h2>
        {loading ? <Loader /> : <PaymentHistory payments={payments} />}
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* Payment modal */}
      <Modal
        isOpen={payModal}
        onClose={() => { setPayModal(false); setSelectedBooking(null) }}
        title="Pay Rent"
        size="sm"
      >
        {selectedBooking && (
          <PaymentForm
            bookingId={selectedBooking.id}
            amount={selectedBooking.property?.monthlyRent}
            onSuccess={() => {
              setPayModal(false)
              setSelectedBooking(null)
              dispatch(fetchMyPayments({ page: 0, size: 10 }))
            }}
          />
        )}
      </Modal>
    </div>
  )
}

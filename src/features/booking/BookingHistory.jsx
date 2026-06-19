import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyBookings } from '@/redux/slices/bookingSlice'
import BookingCard from '@/components/booking/BookingCard'
import Loader from '@/components/common/Loader'
import Pagination from '@/components/common/Pagination'
import { BOOKING_STATUS } from '@/utils/constants'
import clsx from 'clsx'

const STATUS_TABS = ['ALL', ...Object.keys(BOOKING_STATUS)]

export default function BookingHistory() {
  const dispatch = useDispatch()
  const { myBookings, loading, totalPages } = useSelector(s => s.booking)
  const [page, setPage]     = useState(0)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    dispatch(fetchMyBookings({ page, size: 10 }))
  }, [dispatch, page])

  const filtered = filter === 'ALL'
    ? myBookings
    : myBookings.filter(b => b.status === filter)

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-stone-900 mb-2">Booking History</h1>
      <p className="text-stone-500 text-sm mb-6">All your past and present bookings</p>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-1">
        {STATUS_TABS.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={clsx(
              'btn btn-sm shrink-0',
              filter === s ? 'btn-primary' : 'btn-outline'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : filtered.length === 0 ? (
        <div className="card p-12 text-center text-stone-400">
          <p>No bookings with status <strong>{filter}</strong></p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(b => <BookingCard key={b.id} booking={b} />)}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

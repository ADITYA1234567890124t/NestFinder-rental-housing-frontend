import { Calendar, MapPin, User, Clock } from 'lucide-react'
import { formatDate } from '@/utils/dateFormatter'
import { formatCurrency } from '@/utils/formatCurrency'
import { STATUS_BADGE } from '@/utils/constants'

export default function BookingCard({ booking, actions }) {
  const statusColor = STATUS_BADGE[booking.status] || 'neutral'
  const property = booking.property || {}
  const propertyTitle = property.title || booking.propertyTitle || `Property #${booking.propertyId || '-'}`
  const propertyLocation = [property.city, property.state].filter(Boolean).join(', ')
  const tenant = booking?.tenant || booking?.user || booking?.bookedBy
  const tenantName = tenant?.fullName || tenant?.name || booking?.tenantName || 'Tenant'

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-stone-900 truncate">{propertyTitle}</h3>
          {propertyLocation && (
            <p className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />{propertyLocation}
            </p>
          )}
        </div>
        <span className={`badge badge-${statusColor} shrink-0`}>{booking.status}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        {booking.visitDate && (
          <div className="flex items-center gap-2 text-stone-600">
            <Calendar className="w-4 h-4 text-stone-400" />
            <div><p className="text-xs text-stone-400">Visit Date</p>{formatDate(booking.visitDate)}</div>
          </div>
        )}
        {booking.visitTimeSlot && (
          <div className="flex items-center gap-2 text-stone-600">
            <Clock className="w-4 h-4 text-stone-400" />
            <div><p className="text-xs text-stone-400">Time Slot</p>{booking.visitTimeSlot}</div>
          </div>
        )}
        {tenant && (
          <div className="flex items-center gap-2 text-stone-600">
            <User className="w-4 h-4 text-stone-400" />
            <div><p className="text-xs text-stone-400">Tenant</p>{tenantName}</div>
          </div>
        )}
        <div>
          <p className="text-xs text-stone-400">Monthly Rent</p>
          <p className="font-semibold text-primary-600">{formatCurrency(property.monthlyRent || booking.monthlyRent)}</p>
        </div>
      </div>

      {booking.tenantNotes && (
        <div className="bg-stone-50 rounded-xl px-3 py-2 text-xs text-stone-600 mb-3">
          <span className="font-medium">Note: </span>{booking.tenantNotes}
        </div>
      )}

      {actions && <div className="flex flex-wrap gap-2 pt-3 border-t border-stone-100">{actions}</div>}
    </div>
  )
}

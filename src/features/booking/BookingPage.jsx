import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPropertyById } from '@/redux/slices/propertySlice'
import BookingForm from '@/components/booking/BookingForm'
import Loader from '@/components/common/Loader'
import { useBooking } from '@/hooks/useBooking'
import { formatCurrency } from '@/utils/formatCurrency'
import { ArrowLeft, MapPin, Bed, Shield } from 'lucide-react'

export default function BookingPage() {
  const { propertyId } = useParams()
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { selected: property, loading } = useSelector(s => s.property)
  const { book, loading: bookLoading } = useBooking()

  useEffect(() => {
    dispatch(fetchPropertyById(propertyId))
  }, [propertyId, dispatch])

  const handleBook = async (data) => {
    const result = await book(data)
    if (result) navigate('/tenant/bookings')
  }

  if (loading) return <Loader />

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="btn btn-ghost p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-semibold text-stone-900">Book a Visit</h1>
          <p className="text-stone-500 text-sm">Schedule your property visit</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Property summary */}
        {property && (
          <div className="card p-6">
            <img
              src={property.imageUrls?.[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80'}
              alt={property.title}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <div className="flex items-start justify-between gap-2 mb-3">
              <h2 className="font-semibold text-stone-900 text-lg">{property.title}</h2>
              {property.verified && (
                <span className="badge badge-success gap-1 shrink-0">
                  <Shield className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <p className="flex items-center gap-1.5 text-stone-500 text-sm mb-3">
              <MapPin className="w-4 h-4" />
              {property.address}, {property.city}, {property.state}
            </p>
            <div className="flex items-center gap-3 text-sm text-stone-500 mb-4">
              <span className="flex items-center gap-1">
                <Bed className="w-4 h-4 text-stone-400" />
                {property.bhk} BHK
              </span>
              {property.furnishingStatus && (
                <span className="badge badge-neutral">{property.furnishingStatus}</span>
              )}
            </div>
            <div className="border-t border-stone-100 pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-stone-500">Monthly Rent</span>
                <span className="font-semibold text-primary-600 text-lg">
                  {formatCurrency(property.monthlyRent)}
                </span>
              </div>
              {property.depositAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Security Deposit</span>
                  <span className="font-medium text-stone-900">
                    {formatCurrency(property.depositAmount)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Booking form */}
        <div className="card p-6">
          <h2 className="font-semibold text-stone-900 mb-5">Schedule Your Visit</h2>
          <BookingForm
            propertyId={Number(propertyId)}
            onSubmit={handleBook}
            loading={bookLoading}
          />
        </div>
      </div>
    </div>
  )
}

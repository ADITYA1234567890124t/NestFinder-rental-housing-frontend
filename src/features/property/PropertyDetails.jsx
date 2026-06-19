import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPropertyById } from '@/redux/slices/propertySlice'
import { fetchPropertyReviews } from '@/redux/slices/reviewSlice'
import PropertyGallery from '@/components/property/PropertyGallery'
import PropertyMap     from '@/components/property/PropertyMap'
import ReviewCard      from '@/components/review/ReviewCard'
import ReviewForm      from '@/components/review/ReviewForm'
import BookingForm     from '@/components/booking/BookingForm'
import { RatingStars } from '@/components/review/RatingStars'
import Modal           from '@/components/common/Modal'
import Loader          from '@/components/common/Loader'
import { formatCurrency } from '@/utils/formatCurrency'
import { useBooking } from '@/hooks/useBooking'
import { MapPin, Bed, Maximize2, Shield, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PropertyDetails() {
  const { id }      = useParams()
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const { selected: property, loading } = useSelector(s => s.property)
  const { reviews } = useSelector(s => s.review)
  const { token, user } = useSelector(s => s.auth)
  const { book }    = useBooking()
  const [bookModal, setBookModal] = useState(false)

  useEffect(() => {
    dispatch(fetchPropertyById(id))
    dispatch(fetchPropertyReviews({ pid: id, params: { page: 0, size: 10 } }))
  }, [id, dispatch])

  const handleBook = async (data) => {
    if (!token) { toast.error('Please login to book'); navigate('/login'); return }
    const result = await book(data)
    if (result) setBookModal(false)
  }

  if (loading) return <Loader />
  if (!property) return null

  const amenityList = property.amenities ? property.amenities.split(',').map(a => a.trim()) : []

  return (
    <div className="py-8">
      <div className="page-container max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            <PropertyGallery images={property.imageUrls} />

            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-2xl font-display font-semibold text-stone-900">{property.title}</h1>
                  <p className="flex items-center gap-1.5 text-stone-500 mt-1">
                    <MapPin className="w-4 h-4" />{property.address}, {property.city}, {property.state}
                  </p>
                </div>
                {property.verified && <span className="badge badge-success gap-1 shrink-0"><Shield className="w-3.5 h-3.5" />Verified</span>}
              </div>

              {property.averageRating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <RatingStars rating={Math.round(property.averageRating)} />
                  <span className="text-sm text-stone-500">{property.averageRating?.toFixed(1)} ({property.reviewCount} reviews)</span>
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-stone-600 mb-5">
                <span className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-stone-400" />{property.bhk} BHK</span>
                {property.areaSqFt > 0 && <span className="flex items-center gap-1.5"><Maximize2 className="w-4 h-4 text-stone-400" />{property.areaSqFt} sq.ft</span>}
                {property.furnishingStatus && <span className="badge badge-neutral">{property.furnishingStatus}</span>}
                {property.propertyType    && <span className="badge badge-primary">{property.propertyType}</span>}
              </div>

              {property.description && (
                <div className="card p-5">
                  <h3 className="font-semibold text-stone-900 mb-2">Description</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{property.description}</p>
                </div>
              )}
            </div>

            {amenityList.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-stone-900 mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {amenityList.map(a => <span key={a} className="badge badge-neutral px-3 py-1">{a}</span>)}
                </div>
              </div>
            )}

            <PropertyMap latitude={property.latitude} longitude={property.longitude} address={property.address} />

            {/* Owner info */}
            {property.owner && (
              <div className="card p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold">
                  {property.owner.fullName?.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-stone-900">{property.owner.fullName}</p>
                  <p className="text-xs text-stone-500">Property Owner</p>
                </div>
                {token && user?.role === 'TENANT' && (
                  <Link to="/tenant/messages" className="btn btn-outline btn-sm gap-1"><MessageCircle className="w-4 h-4" />Chat</Link>
                )}
              </div>
            )}

            {/* Reviews */}
            <div>
              <h3 className="font-semibold text-stone-900 mb-4">Reviews ({reviews.length})</h3>
              {token && user?.role === 'TENANT' && <ReviewForm propertyId={Number(id)} />}
              <div className="mt-4 space-y-3">
                {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
              </div>
            </div>
          </div>

          {/* Right: Booking panel */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="mb-4">
                <p className="text-3xl font-display font-bold text-primary-600">{formatCurrency(property.monthlyRent)}</p>
                <p className="text-stone-400 text-sm">per month</p>
              </div>
              {property.depositAmount > 0 && (
                <p className="text-sm text-stone-500 mb-4">Deposit: {formatCurrency(property.depositAmount)}</p>
              )}
              {property.available ? (
                <>
                  {token && user?.role === 'TENANT' ? (
                    <button onClick={() => setBookModal(true)} className="btn btn-primary w-full btn-lg">Book a Visit</button>
                  ) : !token ? (
                    <Link to="/login" className="btn btn-primary w-full btn-lg">Login to Book</Link>
                  ) : null}
                </>
              ) : (
                <div className="bg-stone-100 rounded-xl px-4 py-3 text-center text-stone-500 text-sm">Not Available</div>
              )}

              <div className="mt-5 pt-5 border-t border-stone-100 space-y-2 text-sm text-stone-500">
                <div className="flex justify-between"><span>Floor</span><span className="font-medium text-stone-900">{property.floorNumber ?? '-'} / {property.totalFloors ?? '-'}</span></div>
                <div className="flex justify-between"><span>City</span><span className="font-medium text-stone-900">{property.city}</span></div>
                <div className="flex justify-between"><span>Pincode</span><span className="font-medium text-stone-900">{property.pincode || '-'}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={bookModal} onClose={() => setBookModal(false)} title="Book a Property Visit">
        <BookingForm propertyId={Number(id)} onSubmit={handleBook} />
      </Modal>
    </div>
  )
}

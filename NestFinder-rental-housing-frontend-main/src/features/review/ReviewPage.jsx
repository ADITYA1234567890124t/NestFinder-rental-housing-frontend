import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPropertyReviews, deleteReview } from '@/redux/slices/reviewSlice'
import ReviewCard from '@/components/review/ReviewCard'
import ReviewForm from '@/components/review/ReviewForm'
import { RatingStars } from '@/components/review/RatingStars'
import Loader from '@/components/common/Loader'
import Pagination from '@/components/common/Pagination'
import { Star } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ReviewPage() {
  const [searchParams] = useSearchParams()
  const propertyId = searchParams.get('propertyId')
  const dispatch   = useDispatch()
  const { reviews, loading } = useSelector(s => s.review)
  const { user } = useSelector(s => s.auth)
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (propertyId) dispatch(fetchPropertyReviews({ pid: propertyId, params: { page, size: 10 } }))
  }, [dispatch, propertyId, page])

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  const handleDelete = async (reviewId) => {
    await dispatch(deleteReview(reviewId))
    toast.success('Review deleted')
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-semibold text-stone-900">Reviews</h1>
        {reviews.length > 0 && (
          <div className="flex items-center gap-3 mt-3">
            <span className="text-4xl font-display font-bold text-stone-900">{avgRating}</span>
            <div>
              <RatingStars rating={Math.round(Number(avgRating))} size="md" />
              <p className="text-xs text-stone-400 mt-0.5">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        )}
      </div>

      {/* Rating distribution */}
      {reviews.length > 0 && (
        <div className="card p-5 mb-6">
          <h3 className="font-semibold text-stone-900 mb-3">Rating Breakdown</h3>
          {[5, 4, 3, 2, 1].map(star => {
            const count = reviews.filter(r => r.rating === star).length
            const pct   = reviews.length ? Math.round((count / reviews.length) * 100) : 0
            return (
              <div key={star} className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1 w-12 text-sm text-stone-600">
                  {star} <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-stone-400 w-8 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Add review (only tenant) */}
      {user?.role === 'TENANT' && propertyId && (
        <div className="mb-6">
          <ReviewForm
            propertyId={Number(propertyId)}
            onSuccess={() => dispatch(fetchPropertyReviews({ pid: propertyId, params: { page: 0, size: 10 } }))}
          />
        </div>
      )}

      {/* Review list */}
      {loading ? <Loader /> : reviews.length === 0 ? (
        <div className="card p-12 text-center text-stone-400">
          <Star className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <ReviewCard key={r.id} review={r} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={Math.ceil(reviews.length / 10)} onPageChange={setPage} />
    </div>
  )
}

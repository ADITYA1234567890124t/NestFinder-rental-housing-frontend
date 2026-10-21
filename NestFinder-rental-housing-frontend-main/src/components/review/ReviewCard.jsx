import { RatingStars } from './RatingStars'
import { timeAgo } from '@/utils/dateFormatter'
import { getInitials } from '@/utils/validators'
import { Trash2 } from 'lucide-react'
import { useSelector } from 'react-redux'

export default function ReviewCard({ review, onDelete }) {
  const { user } = useSelector(s => s.auth)
  const isOwn = user?.id === review.reviewer?.id

  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-sm font-semibold shrink-0">
          {getInitials(review.reviewer?.fullName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-medium text-stone-900 text-sm">{review.reviewer?.fullName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <RatingStars rating={review.rating} size="sm" />
                <span className="text-xs text-stone-400">{timeAgo(review.createdAt)}</span>
              </div>
            </div>
            {isOwn && onDelete && (
              <button onClick={() => onDelete(review.id)} className="text-stone-400 hover:text-red-500 transition-colors p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          {review.comment && <p className="text-sm text-stone-600 mt-2 leading-relaxed">{review.comment}</p>}
        </div>
      </div>
    </div>
  )
}

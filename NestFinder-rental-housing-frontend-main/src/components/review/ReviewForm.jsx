import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addReview } from '@/redux/slices/reviewSlice'
import { RatingStars } from './RatingStars'
import Button from '@/components/common/Button'
import toast from 'react-hot-toast'

export default function ReviewForm({ propertyId, onSuccess }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(s => s.review)
  const [rating,  setRating]  = useState(0)
  const [comment, setComment] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!rating) { toast.error('Please select a rating'); return }
    const result = await dispatch(addReview({ propertyId, rating, comment }))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Review submitted!')
      setRating(0); setComment('')
      onSuccess?.()
    } else {
      toast.error(result.payload || 'Failed to submit review')
    }
  }

  return (
    <form onSubmit={submit} className="card p-5 space-y-4">
      <h3 className="font-semibold text-stone-900">Write a Review</h3>
      <div>
        <label className="label">Your Rating *</label>
        <RatingStars rating={rating} size="lg" interactive onChange={setRating} />
      </div>
      <div>
        <label className="label">Comment (optional)</label>
        <textarea className="input resize-none" rows={3} value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience…" />
      </div>
      <Button type="submit" loading={loading}>Submit Review</Button>
    </form>
  )
}

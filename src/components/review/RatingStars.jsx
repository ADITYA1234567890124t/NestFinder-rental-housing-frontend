import { Star } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

export function RatingStars({ rating = 0, max = 5, size = 'sm', interactive = false, onChange }) {
  const [hover, setHover] = useState(0)
  const sz = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' }[size]

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map(star => (
        <button key={star} type={interactive ? 'button' : undefined}
          disabled={!interactive}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onChange?.(star)}
          className={clsx('transition-colors', interactive && 'cursor-pointer hover:scale-110')}>
          <Star className={clsx(sz, 'transition-colors',
            star <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-200 fill-stone-200')} />
        </button>
      ))}
    </div>
  )
}

export default RatingStars

import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i)

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0} className="btn btn-outline btn-sm px-2">
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages.map(p => (
        <button key={p} onClick={() => onPageChange(p)} className={clsx('btn btn-sm w-9', p === currentPage ? 'btn-primary' : 'btn-outline')}>
          {p + 1}
        </button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1} className="btn btn-outline btn-sm px-2">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

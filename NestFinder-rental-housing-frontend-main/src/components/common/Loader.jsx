import { Loader2 } from 'lucide-react'

export default function Loader({ text = 'Loading…', fullScreen = false }) {
  if (fullScreen) return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        <p className="text-sm text-stone-500 font-medium">{text}</p>
      </div>
    </div>
  )
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <p className="text-sm text-stone-400">{text}</p>
      </div>
    </div>
  )
}

export function Skeleton({ className = 'h-6 w-full' }) {
  return <div className={`bg-stone-200 rounded-xl animate-pulse ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <Skeleton className="h-44 w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  )
}

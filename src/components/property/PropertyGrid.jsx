import PropertyCard from './PropertyCard'
import { CardSkeleton } from '@/components/common/Loader'

export default function PropertyGrid({ properties = [], loading = false, cols = 3 }) {
  const colClass = { 2:'grid-cols-1 sm:grid-cols-2', 3:'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', 4:'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' }[cols]

  if (loading) return (
    <div className={`grid ${colClass} gap-6`}>
      {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  )

  if (!properties.length) return (
    <div className="text-center py-20">
      <p className="text-stone-500 text-lg">No properties found</p>
      <p className="text-stone-400 text-sm mt-1">Try adjusting your filters</p>
    </div>
  )

  return (
    <div className={`grid ${colClass} gap-6`}>
      {properties.map(p => <PropertyCard key={p.id} property={p} />)}
    </div>
  )
}

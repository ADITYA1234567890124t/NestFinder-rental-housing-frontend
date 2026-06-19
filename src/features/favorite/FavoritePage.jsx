import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFavorites, removeFavorite } from '@/redux/slices/favoriteSlice'
import PropertyGrid from '@/components/property/PropertyGrid'
import Pagination   from '@/components/common/Pagination'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'

export default function FavoritePage() {
  const dispatch = useDispatch()
  const { items, loading } = useSelector(s => s.favorite)
  const [page, setPage] = useState(0)

  useEffect(() => {
    dispatch(fetchFavorites({ page, size: 9 }))
  }, [dispatch, page])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-stone-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-400 fill-red-400" />
            Saved Properties
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            {items.length} saved propert{items.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
      </div>

      {!loading && items.length === 0 ? (
        <div className="card p-16 text-center">
          <Heart className="w-14 h-14 text-stone-200 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-stone-700 mb-2">No saved properties yet</h2>
          <p className="text-stone-400 text-sm">
            Browse properties and click the heart icon to save your favorites
          </p>
        </div>
      ) : (
        <>
          <PropertyGrid properties={items} loading={loading} cols={3} />
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(items.length / 9)}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}

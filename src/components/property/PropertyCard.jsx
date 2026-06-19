import { Link } from 'react-router-dom'
import {
  Heart,
  MapPin,
  Bed,
  Maximize2,
  Star,
  Shield,
} from 'lucide-react'

import { useDispatch, useSelector } from 'react-redux'
import {
  addFavorite,
  removeFavorite,
} from '@/redux/slices/favoriteSlice'

import { formatCurrency } from '@/utils/formatCurrency'
import { truncate } from '@/utils/validators'
import toast from 'react-hot-toast'

export default function PropertyCard({
  property,
  showFav = true,
}) {
  const dispatch = useDispatch()

  const { token } = useSelector((s) => s.auth)
  const { items } = useSelector((s) => s.favorite)

  const isFav = items.some(
    (item) => item.id === property.id
  )

  const toggleFav = async (e) => {
    e.preventDefault()

    if (!token) {
      toast.error('Please login to save favorites')
      return
    }

    try {
      // REMOVE FAVORITE
      if (isFav) {
        const result = await dispatch(
          removeFavorite(property.id)
        )

        if (removeFavorite.fulfilled.match(result)) {
          toast.success('Removed from favorites')
        } else {
          toast.error(
            result.payload || 'Failed to remove favorite'
          )
        }
      }

      // ADD FAVORITE
      else {
        const result = await dispatch(
          addFavorite(property.id)
        )

        if (addFavorite.fulfilled.match(result)) {
          toast.success('Added to favorites')
        } else {
          toast.error(
            result.payload || 'Already in favorites'
          )
        }
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const primaryImage =
    property.imageUrls?.[0] ||
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80'

  return (
    <Link
      to={`/properties/${property.id}`}
      className="card-hover block group overflow-hidden"
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden h-48">
        <img
          src={primaryImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* BADGES */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.verified && (
            <span className="badge badge-success gap-1">
              <Shield className="w-3 h-3" />
              Verified
            </span>
          )}

          <span className="badge badge-primary">
            {property.propertyType || 'Property'}
          </span>
        </div>

        {/* FAVORITE BUTTON */}
        {showFav && (
          <button
            onClick={toggleFav}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition-all"
          >
            <Heart
              className={`w-4 h-4 ${
                isFav
                  ? 'fill-red-500 text-red-500'
                  : 'text-stone-500'
              }`}
            />
          </button>
        )}

        {/* RENT BADGE */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/95 backdrop-blur font-semibold text-stone-900 px-3 py-1 rounded-full text-sm shadow">
            {formatCurrency(property.monthlyRent)}
            <span className="text-stone-400 font-normal text-xs">
              /mo
            </span>
          </span>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4">
        <h3 className="font-semibold text-stone-900 text-sm mb-1 truncate">
          {property.title}
        </h3>

        <p className="flex items-center gap-1 text-xs text-stone-500 mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          {truncate(
            `${property.city}, ${property.state}`,
            40
          )}
        </p>

        <div className="flex items-center gap-3 text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5" />
            {property.bhk} BHK
          </span>

          {property.areaSqFt > 0 && (
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5" />
              {property.areaSqFt} sqft
            </span>
          )}

          {property.averageRating > 0 && (
            <span className="flex items-center gap-1 ml-auto text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {property.averageRating?.toFixed(1)}
            </span>
          )}
        </div>

        {property.furnishingStatus && (
          <div className="mt-3 pt-3 border-t border-stone-100">
            <span className="badge badge-neutral text-xs">
              {property.furnishingStatus}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}

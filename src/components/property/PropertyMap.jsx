import { MapPin } from 'lucide-react'

export default function PropertyMap({ latitude, longitude, address, city, state, pincode }) {
  const location = [address, city, state, pincode].filter(Boolean).join(', ')

  if (!latitude || !longitude) {
    if (!location) return (
      <div className="h-48 bg-stone-100 rounded-2xl flex items-center justify-center">
        <div className="text-center text-stone-400">
          <MapPin className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Location not available</p>
        </div>
      </div>
    )

    const addressSrc = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&z=15&output=embed`
    return (
      <div className="rounded-2xl overflow-hidden h-64 border border-stone-100">
        <iframe title="Property Map" src={addressSrc} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    )
  }

  const src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`
  return (
    <div className="rounded-2xl overflow-hidden h-64 border border-stone-100">
      <iframe title="Property Map" src={src} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  )
}

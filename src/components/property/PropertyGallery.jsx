import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'

export default function PropertyGallery({ images = [] }) {
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const fallback = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80'
  const imgs = images.length ? images : [fallback]

  const prev = () => setCurrent(i => (i - 1 + imgs.length) % imgs.length)
  const next = () => setCurrent(i => (i + 1) % imgs.length)

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden bg-stone-100">
        <img src={imgs[current]} alt="Property" className="w-full h-72 md:h-96 object-cover" />

        {/* Controls */}
        {imgs.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <button onClick={() => setLightbox(true)} className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {current + 1} / {imgs.length}
        </div>
      </div>

      {/* Thumbnails */}
      {imgs.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {imgs.map((img, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === current ? 'border-primary-500' : 'border-transparent opacity-60 hover:opacity-100'}`}>
              <img src={img} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X className="w-7 h-7" />
          </button>
          {imgs.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"><ChevronLeft className="w-6 h-6 text-white" /></button>
              <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"><ChevronRight className="w-6 h-6 text-white" /></button>
            </>
          )}
          <img src={imgs[current]} alt="Property" className="max-w-full max-h-full object-contain rounded-xl" />
        </div>
      )}
    </>
  )
}

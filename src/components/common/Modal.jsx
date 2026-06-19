import { X } from 'lucide-react'
import { useEffect } from 'react'
import clsx from 'clsx'

const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-full mx-4' }

export default function Modal({ isOpen, onClose, title, children, size = 'md', hideClose = false }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={clsx('relative bg-white rounded-2xl shadow-2xl w-full animate-fade-up', sizes[size])}>
        {(title || !hideClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            {title && <h3 className="font-display font-semibold text-lg text-stone-900">{title}</h3>}
            {!hideClose && (
              <button onClick={onClose} className="ml-auto btn-ghost p-1.5 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

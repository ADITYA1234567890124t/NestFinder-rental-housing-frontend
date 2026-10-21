import { AlertCircle, RefreshCw } from 'lucide-react'

export default function ErrorMessage({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7 text-red-400" />
      </div>
      <p className="text-stone-600 mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-outline gap-2">
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      )}
    </div>
  )
}

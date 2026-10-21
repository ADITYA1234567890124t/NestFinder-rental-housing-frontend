import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl font-display font-bold text-stone-200">404</p>
        <h1 className="text-2xl font-semibold text-stone-800 mt-4 mb-2">Page Not Found</h1>
        <p className="text-stone-500 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary gap-2"><Home className="w-4 h-4" />Back to Home</Link>
      </div>
    </div>
  )
}

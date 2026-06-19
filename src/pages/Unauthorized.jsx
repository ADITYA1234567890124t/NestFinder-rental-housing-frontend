import { Link } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'

export default function Unauthorized() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <ShieldOff className="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-stone-800 mb-2">Access Denied</h1>
        <p className="text-stone-500 mb-8">You don't have permission to view this page.</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    </div>
  )
}

import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import AdminSidebar from '@/components/layout/AdminSidebar'
import { Menu, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getInitials } from '@/utils/validators'

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { user } = useSelector(s => s.auth)

  return (
    <div className="min-h-screen flex bg-stone-50">
      <AdminSidebar mobileOpen={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin topbar */}
        <header className="h-16 bg-white border-b border-stone-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="lg:hidden btn btn-ghost p-2"><Menu className="w-5 h-5" /></button>
            <Link to="/" className="flex items-center gap-1.5 text-stone-400 hover:text-stone-700 text-sm">
              <Home className="w-4 h-4" /> Back to Site
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {getInitials(user?.fullName)}
            </div>
            <span className="text-sm font-medium text-stone-700 hidden sm:block">{user?.fullName}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import Navbar   from '@/components/layout/Navbar'
import Sidebar  from '@/components/layout/Sidebar'
import { Menu } from 'lucide-react'

export default function DashLayout() {
  const { user } = useSelector(s => s.auth)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 min-w-0 overflow-hidden">
        <Sidebar role={user?.role} mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile sidebar toggle */}
          <div className="lg:hidden flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-stone-100 bg-white">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open dashboard menu"
              aria-expanded={sidebarOpen}
              className="btn btn-ghost p-2"
            >
              <Menu className="w-5 h-5" />
              <span className="ml-2 text-sm">Menu</span>
            </button>
          </div>
          <main className="flex-1 min-w-0 overflow-y-auto bg-stone-50 p-3 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

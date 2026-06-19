import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Building2, AlertCircle, BarChart2, X } from 'lucide-react'
import clsx from 'clsx'

const links = [
  { to: '/admin',            icon: LayoutDashboard, label: 'Dashboard',    end: true },
  { to: '/admin/users',      icon: Users,           label: 'Manage Users'  },
  { to: '/admin/properties', icon: Building2,       label: 'Properties'    },
  { to: '/admin/complaints', icon: AlertCircle,     label: 'Complaints'    },
]

export default function AdminSidebar({ mobileOpen, onClose }) {
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />}
      <aside className={clsx(
        'fixed top-0 left-0 h-full w-64 bg-stone-900 text-stone-100 z-50 flex flex-col transition-transform duration-300',
        'lg:relative lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-stone-700 shrink-0">
          <span className="font-display font-semibold text-white">Admin Panel</span>
          <button onClick={onClose} className="lg:hidden text-stone-400 hover:text-white p-1.5"><X className="w-4 h-4" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} onClick={onClose}
              className={({ isActive }) => clsx('flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive ? 'bg-primary-500 text-white' : 'text-stone-400 hover:bg-stone-800 hover:text-white')}>
              <Icon className="w-4 h-4" />{label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

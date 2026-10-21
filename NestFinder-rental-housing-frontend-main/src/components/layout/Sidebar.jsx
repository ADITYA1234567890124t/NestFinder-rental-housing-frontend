import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Home, Calendar, Heart, CreditCard, MessageCircle, AlertCircle, Building2, PlusCircle, BarChart2, X } from 'lucide-react'
import clsx from 'clsx'
import { normalizeRole } from '@/utils/roles'

const tenantLinks = [
  { to: '/tenant',           icon: Home,           label: 'Dashboard',   end: true },
  { to: '/tenant/bookings',  icon: Calendar,       label: 'My Bookings'  },
  { to: '/tenant/favorites', icon: Heart,           label: 'Favorites'    },
  { to: '/tenant/payments',  icon: CreditCard,      label: 'Payments'     },
  { to: '/tenant/messages',  icon: MessageCircle,   label: 'Messages'     },
  { to: '/tenant/complaints',icon: AlertCircle,     label: 'Complaints'   },
]

const ownerLinks = [
  { to: '/owner',            icon: BarChart2,       label: 'Dashboard',   end: true },
  { to: '/owner/properties', icon: Building2,       label: 'My Properties'},
  { to: '/owner/properties/add', icon: PlusCircle,  label: 'Add Property' },
  { to: '/owner/bookings',   icon: Calendar,        label: 'Bookings'     },
  { to: '/owner/payments',   icon: CreditCard,      label: 'Payments'     },
  { to: '/owner/messages',   icon: MessageCircle,   label: 'Messages'     },
]

export default function Sidebar({ role, mobileOpen, onClose }) {
  const normalizedRole = normalizeRole(role)
  const adminLinks = [
  { to: '/admin', icon: BarChart2, label: 'Dashboard', end: true },
]

const links =
  normalizedRole === 'OWNER'
    ? ownerLinks
    : normalizedRole === 'ADMIN'
    ? adminLinks
    : tenantLinks
  const { user } = useSelector(s => s.auth)

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/40 lg:hidden" onClick={onClose} />}

      <aside className={clsx(
        'fixed top-0 left-0 h-full w-[min(18rem,calc(100vw-2rem))] bg-white z-0 border-r border-stone-100 z-50 flex flex-col transition-transform duration-300',
        'lg:relative lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-stone-100 shrink-0">
          <span className="font-display font-semibold text-stone-900">
            {normalizedRole === 'OWNER' ? 'Owner Panel' : 'My Account'}
          </span>
          <button onClick={onClose} className="lg:hidden btn btn-ghost p-1.5"><X className="w-4 h-4" /></button>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-stone-100">
          <p className="font-medium text-stone-900 text-sm truncate">{user?.fullName}</p>
          <p className="text-xs text-stone-400 truncate">{user?.email}</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} onClick={onClose}
              className={({ isActive }) => isActive ? 'sidebar-active' : 'sidebar-idle'}>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

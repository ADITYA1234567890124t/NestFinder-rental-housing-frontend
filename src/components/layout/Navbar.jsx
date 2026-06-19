import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  Home,
  Heart,
  MessageCircle,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
} from 'lucide-react'
import { useState } from 'react'
import { logoutUser } from '@/redux/slices/authSlice'
import { getInitials } from '@/utils/validators'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, token } = useSelector((s) => s.auth)
  const { unreadCount, conversations } = useSelector((s) => s.chat)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState(false)

  // FIXED ROUTES
  const dashPath =
    user?.role === 'OWNER'
      ? '/owner/properties'
      : user?.role === 'ADMIN'
      ? '/admin'
      : '/tenant'

  const msgPath = user?.role === 'OWNER' ? '/owner/messages' : '/tenant/messages'

  const handleLogout = async () => {
    await dispatch(logoutUser())
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-100">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-xl">
              NestFinder
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/properties" className="btn btn-ghost text-sm">
              Browse
            </Link>

            <Link to="/search" className="btn btn-ghost text-sm">
              Search
            </Link>

            {token && (
              <Link to={dashPath} className="btn btn-ghost text-sm">
                Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-2">
            {token ? (
              <>
                {/* Favorites */}
                {user?.role === 'TENANT' && (
                  <Link
                    to="/tenant/favorites"
                    className="btn btn-ghost p-2"
                  >
                    <Heart className="w-5 h-5" />
                  </Link>
                )}

                {/* Messages */}
                <Link
                  to={msgPath}
                  className="btn btn-ghost p-2 relative"
                >
                  <MessageCircle className="w-5 h-5" />

                  {(() => {
                    const recentWindowMs = 24 * 60 * 60 * 1000 // 24 hours
                    const now = Date.now()

                    const recentUnread = (conversations || []).reduce((acc, c) => {
                      const last = c?.lastMessage
                      const count = c?.unreadCount || 0
                      if (!last || !count) return acc

                      const t = new Date(last.sentAt || last.timestamp).getTime()
                      if (isNaN(t)) return acc

                      return now - t <= recentWindowMs ? acc + count : acc
                    }, 0)

                    return recentUnread > 0 ? (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-primary-500 text-white text-[10px] rounded-full flex items-center justify-center">
                        {recentUnread}
                      </span>
                    ) : null
                  })()}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfile(!profile)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-stone-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {getInitials(user?.fullName)}
                    </div>

                    <span className="text-sm font-medium text-stone-700 max-w-[120px] truncate">
                      {user?.fullName}
                    </span>
                  </button>

                  {profile && (
                    <div className="absolute right-0 mt-2 w-52 card border shadow-card-lg py-1 animate-fade-in">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="text-xs text-stone-500">
                          Signed in as
                        </p>

                        <p className="text-sm font-medium text-stone-800 truncate">
                          {user?.email}
                        </p>

                        <span className="badge badge-primary mt-1">
                          {user?.role}
                        </span>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setProfile(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>

                      <Link
                        to={dashPath}
                        onClick={() => setProfile(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>

                      <div className="border-t border-stone-100 mt-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline text-sm"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="btn btn-primary text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden btn btn-ghost p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

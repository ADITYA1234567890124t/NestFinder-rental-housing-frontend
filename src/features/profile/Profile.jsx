import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfile } from '@/redux/slices/profileSlice'
import { Link } from 'react-router-dom'
import Loader from '@/components/common/Loader'
import { formatDate } from '@/utils/dateFormatter'
import { getInitials } from '@/utils/validators'
import { Edit2, Lock, User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react'

export default function Profile() {
  const dispatch = useDispatch()
  const { profile, loading } = useSelector(s => s.profile)
  const { user } = useSelector(s => s.auth)

  useEffect(() => { dispatch(fetchProfile()) }, [dispatch])

  const data = profile || user

  if (loading) return <Loader />

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-semibold text-stone-900">My Profile</h1>
        <Link to="/profile/edit" className="btn btn-outline btn-sm gap-1.5">
          <Edit2 className="w-4 h-4" /> Edit Profile
        </Link>
      </div>

      {/* Avatar + name card */}
      <div className="card p-6 mb-4">
        <div className="flex items-center gap-5">
          <div className="relative">
            {data?.profileImageUrl ? (
              <img
                src={data.profileImageUrl}
                alt={data.fullName}
                className="w-20 h-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-700 text-2xl font-semibold">
                {getInitials(data?.fullName)}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-stone-900">{data?.fullName}</h2>
            <p className="text-stone-500 text-sm">{data?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="badge badge-primary">{data?.role}</span>
              {data?.verified && (
                <span className="badge badge-success gap-1">
                  <Shield className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="card p-6 mb-4">
        <h3 className="font-semibold text-stone-900 mb-4">Personal Information</h3>
        <div className="space-y-4">
          {[
            { icon: User,     label: 'Full Name', value: data?.fullName },
            { icon: Mail,     label: 'Email',     value: data?.email    },
            { icon: Phone,    label: 'Phone',     value: data?.phone || '—' },
            { icon: MapPin,   label: 'City',      value: [data?.city, data?.state].filter(Boolean).join(', ') || '—' },
            { icon: Calendar, label: 'Member Since', value: data?.createdAt ? formatDate(data.createdAt) : '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-9 h-9 bg-stone-100 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-stone-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-stone-400">{label}</p>
                <p className="text-stone-800 font-medium text-sm truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="card p-5 flex flex-col sm:flex-row gap-3">
        <Link to="/profile/edit" className="btn btn-primary flex-1 gap-2">
          <Edit2 className="w-4 h-4" /> Edit Profile
        </Link>
        <Link to="/profile/password" className="btn btn-outline flex-1 gap-2">
          <Lock className="w-4 h-4" /> Change Password
        </Link>
      </div>
    </div>
  )
}

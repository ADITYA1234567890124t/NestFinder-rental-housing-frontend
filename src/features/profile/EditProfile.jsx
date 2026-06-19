import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfile, updateProfile, uploadAvatar, clearStatus } from '@/redux/slices/profileSlice'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Input, { Select } from '@/components/common/Input'
import Button from '@/components/common/Button'
import Loader from '@/components/common/Loader'
import { ArrowLeft, Camera } from 'lucide-react'
import { INDIAN_STATES } from '@/utils/constants'
import { getInitials } from '@/utils/validators'
import toast from 'react-hot-toast'

export default function EditProfile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { profile, loading, success } = useSelector(s => s.profile)
  const avatarRef = useRef(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    dispatch(fetchProfile())
    return () => dispatch(clearStatus())
  }, [dispatch])

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName,
        phone:    profile.phone,
        city:     profile.city,
        state:    profile.state,
        address:  profile.address,
      })
    }
  }, [profile, reset])

  useEffect(() => {
    if (success) {
      toast.success('Profile updated!')
      navigate('/profile')
    }
  }, [success, navigate])

  const onSubmit = (data) => dispatch(updateProfile(data))

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    const result = await dispatch(uploadAvatar(fd))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Profile picture updated!')
    } else {
      toast.error('Failed to upload image')
    }
  }

  if (loading && !profile) return <Loader />

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="btn btn-ghost p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-display font-semibold text-stone-900">Edit Profile</h1>
      </div>

      {/* Avatar upload */}
      <div className="card p-6 mb-5 flex items-center gap-5">
        <div className="relative">
          {profile?.profileImageUrl ? (
            <img
              src={profile.profileImageUrl}
              alt={profile.fullName}
              className="w-20 h-20 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-700 text-2xl font-semibold">
              {getInitials(profile?.fullName)}
            </div>
          )}
          <button
            type="button"
            onClick={() => avatarRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-600"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <input
            ref={avatarRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <p className="font-medium text-stone-900">{profile?.fullName}</p>
          <p className="text-sm text-stone-400 mt-0.5">Click the camera icon to update photo</p>
        </div>
      </div>

      {/* Form */}
      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            error={errors.fullName?.message}
            {...register('fullName', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })}
          />
          <Input
            label="Phone Number"
            error={errors.phone?.message}
            {...register('phone', {
              pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit Indian mobile number' },
            })}
          />
          <div>
            <label className="label">State</label>
            <select className="input" {...register('state')}>
              <option value="">Select State</option>
              {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <Input label="City"    {...register('city')} />
          <Input label="Address" {...register('address')} />

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading} className="flex-1">Save Changes</Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

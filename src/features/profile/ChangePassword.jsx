import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changePassword, clearStatus } from '@/redux/slices/profileSlice'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ChangePassword() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, success, error } = useSelector(s => s.profile)

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm()
  const newPassword = watch('newPassword')

  useEffect(() => { return () => dispatch(clearStatus()) }, [dispatch])

  useEffect(() => {
    if (success) {
      toast.success('Password changed successfully!')
      reset()
      navigate('/profile')
    }
  }, [success, navigate, reset])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const onSubmit = (data) => {
    dispatch(changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword }))
  }

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="btn btn-ghost p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-display font-semibold text-stone-900">Change Password</h1>
      </div>

      {/* Security tips */}
      <div className="card p-4 mb-6 flex items-start gap-3 bg-primary-50 border-primary-100">
        <ShieldCheck className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-primary-800 text-sm">Password Requirements</p>
          <ul className="text-xs text-primary-600 mt-1 space-y-0.5">
            <li>• Minimum 8 characters</li>
            <li>• At least one uppercase letter (A–Z)</li>
            <li>• At least one lowercase letter (a–z)</li>
            <li>• At least one digit (0–9)</li>
            <li>• At least one special character (!@#$%^&*)</li>
          </ul>
        </div>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            icon={Lock}
            placeholder="Enter current password"
            error={errors.currentPassword?.message}
            {...register('currentPassword', { required: 'Current password is required' })}
          />

          <Input
            label="New Password"
            type="password"
            icon={Lock}
            placeholder="Enter new password"
            error={errors.newPassword?.message}
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                message: 'Must contain uppercase, lowercase, number & special character',
              },
            })}
          />

          <Input
            label="Confirm New Password"
            type="password"
            icon={Lock}
            placeholder="Repeat new password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your new password',
              validate: v => v === newPassword || 'Passwords do not match',
            })}
          />

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading} className="flex-1">Update Password</Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

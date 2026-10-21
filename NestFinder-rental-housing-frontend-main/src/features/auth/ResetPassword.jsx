import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    // In production: call API with token + new password
    // await authApi.resetPassword({ token, password: data.password })
    toast.success('Password reset successfully! Please login.')
    navigate('/login')
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-semibold text-stone-900">Reset Password</h1>
          <p className="text-stone-500 text-sm mt-2">Enter your new password below</p>
        </div>

        <div className="card p-8">
          {!token ? (
            <div className="text-center py-4">
              <p className="text-red-500 mb-4">Invalid or expired reset link.</p>
              <Link to="/forgot-password" className="btn btn-primary">Request New Link</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                icon={Lock}
                placeholder="Min 8 characters"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Minimum 8 characters' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                    message: 'Must contain uppercase, lowercase, number and special character',
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
                  required: 'Please confirm your password',
                  validate: (v) => v === password || 'Passwords do not match',
                })}
              />

              <Button type="submit" className="w-full" size="lg">
                Reset Password
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-stone-500 mt-4">
            <Link to="/login" className="text-primary-600 hover:underline">
              ← Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { User, Mail, Lock, Phone, Home } from 'lucide-react'

export default function Register() {
  const { register: doRegister, loading } = useAuth()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const pw = watch('password')

  const onSubmit = (data) => doRegister(data)

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center"><Home className="w-5 h-5 text-white" /></div>
            <span className="font-display font-semibold text-2xl">NestFinder</span>
          </Link>
          <h1 className="text-2xl font-display font-semibold text-stone-900">Create your account</h1>
          <p className="text-stone-500 text-sm mt-1">Join thousands of renters and property owners</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" icon={User} placeholder="John Doe"
              error={errors.fullName?.message}
              {...register('fullName', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} />

            <Input label="Email" type="email" icon={Mail} placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} />

            <Input label="Phone Number" icon={Phone} placeholder="9876543210"
              error={errors.phone?.message}
              {...register('phone', { pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid Indian phone number' } })} />

            <Input label="Password" type="password" icon={Lock} placeholder="Min 8 characters"
              error={errors.password?.message}
              {...register('password', { required: 'Password required', minLength: { value: 8, message: 'Min 8 characters' } })} />

            <Input label="Confirm Password" type="password" icon={Lock} placeholder="Repeat password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', { required: 'Please confirm password', validate: v => v === pw || 'Passwords do not match' })} />

            <div>
              <label className="label">I am a *</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ val:'TENANT', label:'Tenant', sub:'Looking for a home' },{ val:'OWNER', label:'Property Owner', sub:'Want to list my property' }].map(({ val, label, sub }) => (
                  <label key={val} className="relative cursor-pointer">
                    <input type="radio" value={val} className="sr-only peer" {...register('role', { required: true })} />
                    <div className="border-2 border-stone-200 rounded-xl p-3 peer-checked:border-primary-500 peer-checked:bg-primary-50 transition-all">
                      <p className="font-medium text-stone-900 text-sm">{label}</p>
                      <p className="text-stone-400 text-xs mt-0.5">{sub}</p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.role && <p className="error-msg">Please select a role</p>}
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">Create Account</Button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm()
  const onSubmit = () => toast.success('If that email exists, you\'ll receive a reset link shortly.')

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-semibold text-stone-900">Forgot Password</h1>
          <p className="text-stone-500 text-sm mt-2">Enter your email and we'll send you a reset link</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Email Address" type="email" icon={Mail} placeholder="you@example.com" {...register('email', { required: true })} />
            <Button type="submit" className="w-full" size="lg">Send Reset Link</Button>
          </form>
          <p className="text-center text-sm text-stone-500 mt-4">
            <Link to="/login" className="text-primary-600 hover:underline">← Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

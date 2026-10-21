import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { Mail, Lock, Home } from 'lucide-react'

export default function Login() {
  const { login, loading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    login(data)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>

            <span className="font-display font-semibold text-2xl">
              NestFinder
            </span>
          </Link>

          <h1 className="text-2xl font-display font-semibold text-stone-900">
            Welcome back
          </h1>

          <p className="text-stone-500 text-sm mt-1">
            Sign in to your account
          </p>
        </div>

        <div className="card p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
              })}
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
              })}
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-100" />
            </div>

            <div className="relative text-center">
              <span className="bg-white px-3 text-xs text-stone-400">
                New to NestFinder?
              </span>
            </div>
          </div>

          <Link
            to="/register"
            className="btn btn-outline w-full"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  )
}

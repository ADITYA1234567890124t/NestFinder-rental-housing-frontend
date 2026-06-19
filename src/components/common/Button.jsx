import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

const variants = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  ghost:   'btn-ghost',
  danger:  'btn-danger',
  success: 'btn-success',
}
const sizes = { sm: 'btn-sm', md: '', lg: 'btn-lg' }

export default function Button({ children, variant = 'primary', size = 'md', loading = false, icon: Icon, className = '', ...props }) {
  return (
    <button className={clsx('btn', variants[variant], sizes[size], className)} disabled={loading || props.disabled} {...props}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon ? <Icon className="w-4 h-4" /> : null}
      {children}
    </button>
  )
}

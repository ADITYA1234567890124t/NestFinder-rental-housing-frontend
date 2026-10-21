import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

const config = {
  PENDING:   { icon: Clock,         color: 'text-amber-500',  bg: 'bg-amber-50',  label: 'Pending Approval' },
  CONFIRMED: { icon: CheckCircle2,  color: 'text-emerald-500',bg: 'bg-emerald-50',label: 'Confirmed' },
  CANCELLED: { icon: XCircle,       color: 'text-red-500',    bg: 'bg-red-50',    label: 'Cancelled' },
  REJECTED:  { icon: XCircle,       color: 'text-red-500',    bg: 'bg-red-50',    label: 'Rejected' },
  COMPLETED: { icon: CheckCircle2,  color: 'text-blue-500',   bg: 'bg-blue-50',   label: 'Completed' },
}

export default function BookingStatus({ status }) {
  const { icon: Icon, color, bg, label } = config[status] || config.PENDING
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium', color, bg)}>
      <Icon className="w-4 h-4" />{label}
    </span>
  )
}

import { TrendingUp, TrendingDown } from 'lucide-react'
import clsx from 'clsx'

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'primary', trend, trendValue }) {
  const colors = {
    primary:  { bg: 'bg-primary-50',  icon: 'text-primary-500',  iconBg: 'bg-primary-100' },
    success:  { bg: 'bg-emerald-50',  icon: 'text-emerald-500',  iconBg: 'bg-emerald-100' },
    warning:  { bg: 'bg-amber-50',    icon: 'text-amber-500',    iconBg: 'bg-amber-100'   },
    info:     { bg: 'bg-blue-50',     icon: 'text-blue-500',     iconBg: 'bg-blue-100'    },
    danger:   { bg: 'bg-red-50',      icon: 'text-red-500',      iconBg: 'bg-red-100'     },
  }
  const c = colors[color] || colors.primary

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-stone-500 font-medium">{title}</p>
          <p className="text-2xl font-display font-semibold text-stone-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>}
          {trendValue !== undefined && (
            <div className={clsx('flex items-center gap-1 mt-2 text-xs font-medium', trend === 'up' ? 'text-emerald-600' : 'text-red-500')}>
              {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {trendValue}
            </div>
          )}
        </div>
        {Icon && (
          <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', c.iconBg)}>
            <Icon className={clsx('w-5 h-5', c.icon)} />
          </div>
        )}
      </div>
    </div>
  )
}

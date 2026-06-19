import { timeAgo } from '@/utils/dateFormatter'
import { Activity } from 'lucide-react'

export default function ActivityCard({ activities = [], title = 'Recent Activity' }) {
  return (
    <div className="card p-5">
      <h3 className="font-semibold text-stone-900 mb-4">{title}</h3>
      {activities.length === 0 ? (
        <div className="text-center py-6 text-stone-400 text-sm">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          No recent activity
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.iconBg || 'bg-stone-100'}`}>
                {item.icon && <item.icon className={`w-4 h-4 ${item.iconColor || 'text-stone-500'}`} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-900">{item.title}</p>
                <p className="text-xs text-stone-400 mt-0.5">{item.description}</p>
              </div>
              <p className="text-xs text-stone-400 shrink-0">{timeAgo(item.time)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

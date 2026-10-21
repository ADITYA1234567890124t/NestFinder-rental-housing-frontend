import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateTime } from '@/utils/dateFormatter'
import { STATUS_BADGE, normalizePaymentStatus } from '@/utils/constants'
import { CreditCard } from 'lucide-react'

export default function PaymentHistory({ payments = [], showTenant = false }) {
  if (!payments.length) return (
    <div className="text-center py-10 text-stone-400">
      <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-50" />
      <p>No payment history yet</p>
    </div>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-100 text-left">
            {[...(showTenant ? ['Tenant', 'Property'] : []), 'Transaction ID','Amount','Method','Status','Date'].map(h => (
              <th key={h} className="pb-3 pr-4 font-medium text-stone-500 text-xs uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-50">
          {payments.map(p => (
            <tr key={p.id} className="py-3">
              {showTenant && <>
                <td className="py-3 pr-4 text-stone-700">{p.tenant?.fullName || p.tenant?.name || p.booking?.tenantName || 'Tenant'}</td>
                <td className="py-3 pr-4 text-stone-600">{p.booking?.property?.title || p.booking?.propertyTitle || '-'}</td>
              </>}
              <td className="py-3 pr-4 font-mono text-xs text-stone-500">{p.transactionId}</td>
              <td className="py-3 pr-4 font-semibold text-stone-900">{formatCurrency(p.amount)}</td>
              <td className="py-3 pr-4 text-stone-600">{p.paymentMethod?.replace(/_/g,' ')}</td>
              <td className="py-3 pr-4">{(() => {
                const status = normalizePaymentStatus(p.status ?? p.paymentStatus)
                return <span className={`badge badge-${STATUS_BADGE[status] || 'neutral'}`}>{status}</span>
              })()}</td>
              <td className="py-3 text-stone-500">{formatDateTime(p.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

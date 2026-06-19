import { useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { CheckCircle2, Home, CreditCard } from 'lucide-react'
import { confirmPayment } from '@/redux/slices/paymentSlice'
import toast from 'react-hot-toast'

export default function PaymentSuccess() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const txnId    = params.get('txnId')

  useEffect(() => {
    if (txnId) {
      dispatch(confirmPayment({ transactionId: txnId }))
        .then((result) => {
          if (result.meta.requestStatus === 'fulfilled') {
            toast.success('Payment confirmed successfully')
          } else {
            toast.error('Payment confirmation failed')
          }
        })
    }
  }, [txnId, dispatch])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        {/* Animated success icon */}
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-up">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>

        <h1 className="text-3xl font-display font-semibold text-stone-900 mb-3">
          Payment Successful!
        </h1>
        <p className="text-stone-500 mb-2">
          Your rent payment has been processed successfully.
        </p>
        {txnId && (
          <div className="bg-stone-50 rounded-xl px-4 py-3 mb-6">
            <p className="text-xs text-stone-400">Transaction ID</p>
            <p className="font-mono text-sm text-stone-700 font-medium">{txnId}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link to="/payments" className="btn btn-primary gap-2">
            <CreditCard className="w-4 h-4" /> View Payment History
          </Link>
          <Link to="/" className="btn btn-outline gap-2">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

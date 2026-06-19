import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { initiatePayment } from '@/redux/slices/paymentSlice'
import { Select } from '@/components/common/Input'
import Button from '@/components/common/Button'
import { PAYMENT_METHODS } from '@/utils/constants'
import { formatCurrency } from '@/utils/formatCurrency'
import toast from 'react-hot-toast'

export default function PaymentForm({ bookingId, amount, onSuccess }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(s => s.payment)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const submit = async (data) => {
    const result = await dispatch(initiatePayment({ bookingId, amount, paymentMethod: data.paymentMethod, notes: data.notes }))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Payment initiated successfully')
      onSuccess?.()
    } else {
      toast.error(result.payload || 'Payment failed')
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="bg-primary-50 rounded-xl px-4 py-3 text-center">
        <p className="text-sm text-stone-500">Amount to Pay</p>
        <p className="text-3xl font-display font-semibold text-primary-600">{formatCurrency(amount)}</p>
      </div>

      <Select label="Payment Method *" error={errors.paymentMethod?.message}
        {...register('paymentMethod', { required: 'Select a payment method' })}>
        <option value="">Select method</option>
        {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m.replace(/_/g, ' ')}</option>)}
      </Select>

      <div>
        <label className="label">Notes (optional)</label>
        <input className="input" placeholder="Transaction reference…" {...register('notes')} />
      </div>

      <Button type="submit" loading={loading} size="lg" className="w-full">
        Pay {formatCurrency(amount)}
      </Button>
    </form>
  )
}

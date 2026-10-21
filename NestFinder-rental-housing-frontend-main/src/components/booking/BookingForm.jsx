import { useForm } from 'react-hook-form'
import Input, { Select, Textarea } from '@/components/common/Input'
import Button from '@/components/common/Button'
import { TIME_SLOTS } from '@/utils/constants'

export default function BookingForm({ propertyId, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const submit = (data) => onSubmit({ ...data, propertyId })

  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <label className="label">Visit Date *</label>
        <input type="date" min={today} className={errors.visitDate ? 'input-error' : 'input'}
          {...register('visitDate', { required: 'Visit date is required' })} />
        {errors.visitDate && <p className="error-msg">{errors.visitDate.message}</p>}
      </div>

      <Select label="Preferred Time Slot" {...register('visitTimeSlot')}>
        <option value="">Select time slot</option>
        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
      </Select>

      <div>
        <label className="label">Move-in Date</label>
        <input type="date" min={today} className="input" {...register('startDate')} />
      </div>

      <div>
        <label className="label">Move-out Date (optional)</label>
        <input type="date" min={today} className="input" {...register('endDate')} />
      </div>

      <div>
        <label className="label">Notes for Owner</label>
        <textarea className="input resize-none" rows={3} placeholder="Any special requirements…"
          {...register('tenantNotes')} />
      </div>

      <Button type="submit" loading={loading} size="lg" className="w-full">
        Request Booking
      </Button>
    </form>
  )
}

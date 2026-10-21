import { useForm } from 'react-hook-form'
import Input, { Select, Textarea } from '@/components/common/Input'
import Button from '@/components/common/Button'
import { PROPERTY_TYPES, FURNISHING_STATUSES, BHK_OPTIONS, INDIAN_STATES } from '@/utils/constants'

export default function PropertyForm({ defaultValues = {}, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input label="Property Title *" error={errors.title?.message} {...register('title', { required: 'Title is required' })} />
        </div>

        <div className="md:col-span-2">
          <Textarea label="Description" {...register('description')} />
        </div>

        <Input label="Monthly Rent (₹) *" type="number" error={errors.monthlyRent?.message}
          {...register('monthlyRent', { required: 'Rent is required', min: { value: 1, message: 'Must be positive' } })} />

        <div>
          <label className="label">BHK *</label>
          <select className={errors.bhk ? 'input-error' : 'input'} {...register('bhk', { required: true })}>
            <option value="">Select BHK</option>
            {BHK_OPTIONS.map(b => <option key={b} value={b}>{b} BHK</option>)}
          </select>
          {errors.bhk && <p className="error-msg">BHK is required</p>}
        </div>

        <div>
          <label className="label">State *</label>
          <select className={errors.state ? 'input-error' : 'input'} {...register('state', { required: true })}>
            <option value="">Select State</option>
            {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
          </select>
          {errors.state && <p className="error-msg">State is required</p>}
        </div>

        <Input label="City *" error={errors.city?.message} {...register('city', { required: 'City is required' })} />
        <div className="md:col-span-2">
          <Input label="Full Address *" error={errors.address?.message} {...register('address', { required: 'Address is required' })} />
        </div>
        <Input label="Pincode" {...register('pincode')} />
        <Input label="Area (sq.ft)" type="number" {...register('areaSqFt')} />

        <div>
          <label className="label">Property Type</label>
          <select className="input" {...register('propertyType')}>
            <option value="">Select Type</option>
            {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Furnishing Status</label>
          <select className="input" {...register('furnishingStatus')}>
            <option value="">Select Status</option>
            {FURNISHING_STATUSES.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>

        <Input label="Deposit Amount (₹)" type="number" {...register('depositAmount')} />
        <Input label="Total Floors" type="number" {...register('totalFloors')} />
        <Input label="Floor Number" type="number" {...register('floorNumber')} />
        <Input label="Latitude" type="number" step="any" {...register('latitude')} />
        <Input label="Longitude" type="number" step="any" {...register('longitude')} />

        <div className="md:col-span-2">
          <Input label="Amenities (comma separated)" placeholder="Parking, Gym, Pool…" {...register('amenities')} />
        </div>
      </div>

      <Button type="submit" loading={loading} size="lg">Save Property</Button>
    </form>
  )
}

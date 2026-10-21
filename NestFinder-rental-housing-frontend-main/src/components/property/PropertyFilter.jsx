import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Select } from '@/components/common/Input'
import Button from '@/components/common/Button'
import { BHK_OPTIONS, PROPERTY_TYPES, FURNISHING_STATUSES, INDIAN_STATES } from '@/utils/constants'

export default function PropertyFilter({ onFilter, loading }) {
  const [filters, setFilters] = useState({ city:'', bhk:'', minRent:'', maxRent:'', propertyType:'', furnishingStatus:'', state:'' })

  const set = (key) => (e) => setFilters(f => ({ ...f, [key]: e.target.value }))
  const reset = () => { const empty = Object.fromEntries(Object.keys(filters).map(k => [k,''])); setFilters(empty); onFilter({}) }
  const submit = (e) => { e.preventDefault(); const clean = Object.fromEntries(Object.entries(filters).filter(([,v]) => v !== '')); onFilter(clean) }

  return (
    <form onSubmit={submit} className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-4 h-4 text-primary-500" />
        <h3 className="font-semibold text-stone-900">Filters</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        <Select value={filters.state} onChange={set('state')}>
          <option value="">All States</option>
          {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
        </Select>

        <input className="input" placeholder="City" value={filters.city} onChange={set('city')} />

        <Select value={filters.bhk} onChange={set('bhk')}>
          <option value="">Any BHK</option>
          {BHK_OPTIONS.map(b => <option key={b} value={b}>{b} BHK</option>)}
        </Select>

        <input className="input" type="number" placeholder="Min Rent" value={filters.minRent} onChange={set('minRent')} min={0} />
        <input className="input" type="number" placeholder="Max Rent" value={filters.maxRent} onChange={set('maxRent')} min={0} />

        <Select value={filters.propertyType} onChange={set('propertyType')}>
          <option value="">Any Type</option>
          {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
        </Select>

        <Select value={filters.furnishingStatus} onChange={set('furnishingStatus')}>
          <option value="">Any Furnishing</option>
          {FURNISHING_STATUSES.map(f => <option key={f}>{f}</option>)}
        </Select>
      </div>

      <div className="flex gap-2 mt-4">
        <Button type="submit" loading={loading}>Apply Filters</Button>
        <Button type="button" variant="outline" icon={X} onClick={reset}>Reset</Button>
      </div>
    </form>
  )
}

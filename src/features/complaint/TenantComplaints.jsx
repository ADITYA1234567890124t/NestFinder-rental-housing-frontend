import { useEffect, useMemo, useState } from 'react'
import complaintApi from '@/api/complaintApi'
import bookingApi from '@/api/bookingApi'
import Button from '@/components/common/Button'
import Input, { Select, Textarea } from '@/components/common/Input'
import Loader from '@/components/common/Loader'
import Pagination from '@/components/common/Pagination'
import { formatDateTime } from '@/utils/dateFormatter'
import { STATUS_BADGE } from '@/utils/constants'
import { AlertCircle, CheckCircle2, Clock, MessageSquare, PlusCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_ICONS = {
  OPEN: { icon: AlertCircle, color: 'text-amber-500' },
  IN_PROGRESS: { icon: Clock, color: 'text-blue-500' },
  RESOLVED: { icon: CheckCircle2, color: 'text-emerald-500' },
  CLOSED: { icon: XCircle, color: 'text-stone-400' },
}

const initialForm = {
  subject: '',
  description: '',
  propertyId: '',
}

export default function TenantComplaints() {
  const [complaints, setComplaints] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [form, setForm] = useState(initialForm)

  const bookedProperties = useMemo(() => {
    const map = new Map()
    bookings.forEach((booking) => {
      const property = booking.property
      if (property?.id && !map.has(property.id)) {
        map.set(property.id, property)
      }
    })
    return Array.from(map.values())
  }, [bookings])

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const { data } = await complaintApi.getMine({ page, size: 10 })
      setComplaints(data.data?.content || [])
      setTotalPages(data.data?.totalPages || 0)
    } catch {
      toast.error('Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      const { data } = await bookingApi.getMyBookings({ page: 0, size: 100 })
      setBookings(data.data?.content || [])
    } catch {
      setBookings([])
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [page])

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.subject.trim()) {
      toast.error('Please enter a complaint subject')
      return
    }

    if (!form.description.trim()) {
      toast.error('Please enter complaint details')
      return
    }

    const payload = {
      subject: form.subject.trim(),
      description: form.description.trim(),
    }

    if (form.propertyId) {
      payload.propertyId = Number(form.propertyId)
    }

    setSubmitting(true)
    try {
      await complaintApi.create(payload)
      toast.success('Complaint submitted')
      setForm(initialForm)
      setPage(0)
      await fetchComplaints()
    } catch {
      toast.error('Failed to submit complaint')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-semibold text-stone-900 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-primary-500" />
          Complaints
        </h1>
        <p className="text-stone-500 text-sm mt-0.5">
          Raise a complaint and track its progress
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-5 mb-6 space-y-4">
        <div className="flex items-center gap-2 text-stone-900 font-semibold">
          <PlusCircle className="w-5 h-5 text-primary-500" />
          New Complaint
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Short complaint title"
          />

          <Select
            label="Related Property"
            name="propertyId"
            value={form.propertyId}
            onChange={handleChange}
          >
            <option value="">General complaint</option>
            {bookedProperties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.title} - {property.city}
              </option>
            ))}
          </Select>
        </div>

        <Textarea
          label="Details"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the issue clearly"
          rows={5}
        />

        <div className="flex justify-end">
          <Button type="submit" loading={submitting} disabled={submitting}>
            Submit Complaint
          </Button>
        </div>
      </form>

      {loading ? (
        <Loader />
      ) : complaints.length === 0 ? (
        <div className="card p-10 text-center">
          <AlertCircle className="w-12 h-12 text-stone-200 mx-auto mb-4" />
          <p className="text-stone-500 font-medium">No complaints yet</p>
          <p className="text-stone-400 text-sm mt-1">Your submitted complaints will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map((complaint) => {
            const { icon: StatusIcon, color } = STATUS_ICONS[complaint.status] || STATUS_ICONS.OPEN
            const badgeVariant = STATUS_BADGE[complaint.status] || 'neutral'

            return (
              <div key={complaint.id} className="card p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-stone-900">{complaint.subject}</h3>
                    <p className="text-xs text-stone-400 mt-0.5">{formatDateTime(complaint.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusIcon className={`w-4 h-4 ${color}`} />
                    <span className={`badge badge-${badgeVariant}`}>{complaint.status}</span>
                  </div>
                </div>

                <p className="text-stone-600 text-sm leading-relaxed mb-3">{complaint.description}</p>

                {complaint.property && (
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-3">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Property: {complaint.property.title} - {complaint.property.city}</span>
                  </div>
                )}

                {complaint.resolution && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
                    <p className="text-xs font-medium text-emerald-700 mb-1">Resolution</p>
                    <p className="text-sm text-emerald-800">{complaint.resolution}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

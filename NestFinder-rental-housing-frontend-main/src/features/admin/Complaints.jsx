import { useEffect, useState } from 'react'
import api from '@/api/axiosConfig'
import Loader from '@/components/common/Loader'
import Pagination from '@/components/common/Pagination'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import { formatDateTime } from '@/utils/dateFormatter'
import { getInitials } from '@/utils/validators'
import { STATUS_BADGE, COMPLAINT_STATUS } from '@/utils/constants'
import {
  AlertCircle, CheckCircle2, Clock,
  XCircle, MessageSquare, Filter,
} from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const STATUS_OPTIONS = ['ALL', ...Object.keys(COMPLAINT_STATUS)]

const STATUS_ICONS = {
  OPEN:        { icon: AlertCircle,   color: 'text-amber-500'   },
  IN_PROGRESS: { icon: Clock,         color: 'text-blue-500'    },
  RESOLVED:    { icon: CheckCircle2,  color: 'text-emerald-500' },
  CLOSED:      { icon: XCircle,       color: 'text-stone-400'   },
}

export default function Complaints() {
  const [complaints, setComplaints] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [page,       setPage]       = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [filter,     setFilter]     = useState('ALL')
  const [selected,   setSelected]   = useState(null)   // complaint being resolved
  const [resolution, setResolution] = useState('')
  const [newStatus,  setNewStatus]  = useState('RESOLVED')
  const [submitting, setSubmitting] = useState(false)

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const params = { page, size: 10 }
      if (filter !== 'ALL') params.status = filter
      const { data } = await api.get('/complaints', { params })
      setComplaints(data.data?.content || [])
      setTotalPages(data.data?.totalPages || 0)
    } catch {
      toast.error('Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchComplaints() }, [page, filter])

  const handleUpdateStatus = async () => {
    if (!resolution.trim()) { toast.error('Please enter a resolution note'); return }
    setSubmitting(true)
    try {
      await api.patch(`/complaints/${selected.id}/status`, {
        status: newStatus,
        resolution,
      })
      toast.success(`Complaint marked as ${newStatus.toLowerCase()}`)
      setSelected(null)
      setResolution('')
      fetchComplaints()
    } catch {
      toast.error('Failed to update complaint')
    } finally {
      setSubmitting(false)
    }
  }

  const openResolveModal = (complaint) => {
    setSelected(complaint)
    setNewStatus('RESOLVED')
    setResolution(complaint.resolution || '')
  }

  // Summary counts
  const counts = {
    OPEN:        complaints.filter(c => c.status === 'OPEN').length,
    IN_PROGRESS: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    RESOLVED:    complaints.filter(c => c.status === 'RESOLVED').length,
    CLOSED:      complaints.filter(c => c.status === 'CLOSED').length,
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-semibold text-stone-900 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-primary-500" />
          Complaints Management
        </h1>
        <p className="text-stone-500 text-sm mt-0.5">
          Review and resolve user complaints
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Open',        count: counts.OPEN,        color: 'bg-amber-50  border-amber-200',  text: 'text-amber-700',   icon: AlertCircle   },
          { label: 'In Progress', count: counts.IN_PROGRESS, color: 'bg-blue-50   border-blue-200',   text: 'text-blue-700',    icon: Clock         },
          { label: 'Resolved',    count: counts.RESOLVED,    color: 'bg-emerald-50 border-emerald-200',text: 'text-emerald-700', icon: CheckCircle2  },
          { label: 'Closed',      count: counts.CLOSED,      color: 'bg-stone-50  border-stone-200',  text: 'text-stone-600',   icon: XCircle       },
        ].map(({ label, count, color, text, icon: Icon }) => (
          <div key={label} className={`border rounded-2xl p-4 ${color}`}>
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-4 h-4 ${text}`} />
              <span className={`text-xs font-medium ${text}`}>{label}</span>
            </div>
            <p className={`text-2xl font-display font-bold ${text}`}>{count}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-stone-400 shrink-0" />
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(0) }}
            className={clsx('btn btn-sm shrink-0', filter === s ? 'btn-primary' : 'btn-outline')}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Complaints list */}
      {loading ? <Loader /> : complaints.length === 0 ? (
        <div className="card p-12 text-center">
          <AlertCircle className="w-12 h-12 text-stone-200 mx-auto mb-4" />
          <p className="text-stone-500 font-medium">No complaints found</p>
          <p className="text-stone-400 text-sm mt-1">
            {filter !== 'ALL' ? `No complaints with status "${filter}"` : 'All clear!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map(complaint => {
            const { icon: StatusIcon, color: statusColor } = STATUS_ICONS[complaint.status] || STATUS_ICONS.OPEN
            const badgeVariant = STATUS_BADGE[complaint.status] || 'neutral'

            return (
              <div key={complaint.id} className="card p-5">
                <div className="flex items-start gap-4">
                  {/* User avatar */}
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-sm shrink-0">
                    {getInitials(complaint.complainant?.fullName)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <h3 className="font-semibold text-stone-900">{complaint.subject}</h3>
                        <p className="text-xs text-stone-400 mt-0.5">
                          By <span className="text-stone-600 font-medium">{complaint.complainant?.fullName}</span>
                          {' · '}
                          {formatDateTime(complaint.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                        <span className={`badge badge-${badgeVariant}`}>{complaint.status}</span>
                      </div>
                    </div>

                    <p className="text-stone-600 text-sm leading-relaxed mb-3">
                      {complaint.description}
                    </p>

                    {/* Property info */}
                    {complaint.property && (
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-3">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Property: <span className="font-medium">{complaint.property.title}</span>
                        — {complaint.property.city}
                      </div>
                    )}

                    {/* Resolution note */}
                    {complaint.resolution && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 mb-3">
                        <p className="text-xs font-medium text-emerald-700 mb-1">Resolution</p>
                        <p className="text-sm text-emerald-800">{complaint.resolution}</p>
                        {complaint.resolvedBy && (
                          <p className="text-xs text-emerald-600 mt-1">
                            Resolved by: {complaint.resolvedBy.fullName}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    {['OPEN', 'IN_PROGRESS'].includes(complaint.status) && (
                      <div className="flex gap-2">
                        {complaint.status === 'OPEN' && (
                          <button
                            onClick={async () => {
                              await api.patch(`/complaints/${complaint.id}/status`, { status: 'IN_PROGRESS', resolution: 'Being investigated' })
                              fetchComplaints()
                              toast.success('Marked as In Progress')
                            }}
                            className="btn btn-sm gap-1 text-blue-600 border border-blue-200 hover:bg-blue-50"
                          >
                            <Clock className="w-3.5 h-3.5" /> Mark In Progress
                          </button>
                        )}
                        <button
                          onClick={() => openResolveModal(complaint)}
                          className="btn btn-success btn-sm gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                        </button>
                        <button
                          onClick={async () => {
                            await api.patch(`/complaints/${complaint.id}/status`, { status: 'CLOSED', resolution: 'Complaint closed by admin' })
                            fetchComplaints()
                            toast.success('Complaint closed')
                          }}
                          className="btn btn-sm gap-1 text-stone-500 border border-stone-200 hover:bg-stone-50"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Close
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Resolve modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => { setSelected(null); setResolution('') }}
        title="Resolve Complaint"
        size="md"
      >
        {selected && (
          <div className="space-y-4">
            <div className="bg-stone-50 rounded-xl p-4">
              <p className="font-medium text-stone-900 text-sm">{selected.subject}</p>
              <p className="text-stone-500 text-xs mt-1">{selected.description}</p>
            </div>

            <div>
              <label className="label">Update Status</label>
              <div className="grid grid-cols-3 gap-2">
                {['IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNewStatus(s)}
                    className={clsx(
                      'py-2 px-3 rounded-xl text-xs font-medium border transition-all',
                      newStatus === s
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    )}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Resolution Note *</label>
              <textarea
                className="input resize-none"
                rows={4}
                placeholder="Describe how this complaint was resolved or the action taken…"
                value={resolution}
                onChange={e => setResolution(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleUpdateStatus}
                loading={submitting}
                disabled={!resolution.trim()}
                className="flex-1"
              >
                <CheckCircle2 className="w-4 h-4" /> Update Status
              </Button>
              <Button
                variant="outline"
                onClick={() => { setSelected(null); setResolution('') }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

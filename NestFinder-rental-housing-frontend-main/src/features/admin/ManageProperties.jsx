import { useEffect, useState } from 'react'
import api from '@/api/axiosConfig'
import Loader from '@/components/common/Loader'
import Pagination from '@/components/common/Pagination'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/dateFormatter'
import { Shield, Trash2, Eye, CheckCircle2, XCircle, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const TABS = ['ALL', 'PENDING', 'VERIFIED']

export default function ManageProperties() {
  const [properties, setProperties]   = useState([])
  const [loading,    setLoading]       = useState(true)
  const [page,       setPage]          = useState(0)
  const [total,      setTotal]         = useState(0)
  const [tab,        setTab]           = useState('ALL')
  const [removeModal,setRemoveModal]   = useState(null)
  const [reason,     setReason]        = useState('')

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const endpoint = tab === 'PENDING'
        ? '/properties/pending-verification'
        : '/properties'
      const { data } = await api.get(endpoint, { params: { page, size: 12 } })
      let content = data.data?.content || []
      if (tab === 'VERIFIED') content = content.filter(p => p.verified)
      setProperties(content)
      setTotal(data.data?.totalPages || 0)
    } catch { toast.error('Failed to load properties') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProperties() }, [page, tab])

  const handleVerify = async (id) => {
    try {
      await api.patch(`/admin/properties/${id}/verify`)
      toast.success('Property verified!')
      fetchProperties()
    } catch { toast.error('Failed to verify') }
  }

  const handleRemove = async () => {
    try {
      await api.delete(`/admin/properties/${removeModal.id}`, { params: { reason } })
      toast.success('Property removed')
      fetchProperties()
    } catch { toast.error('Failed to remove') }
    setRemoveModal(null)
    setReason('')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-stone-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary-500" /> Manage Properties
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">{properties.length} properties</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setPage(0) }}
            className={clsx('btn btn-sm', tab === t ? 'btn-primary' : 'btn-outline')}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {properties.length === 0 ? (
            <div className="col-span-full card p-12 text-center text-stone-400">
              <Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No properties found</p>
            </div>
          ) : properties.map(p => (
            <div key={p.id} className="card p-4">
              <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-stone-100">
                <img
                  src={p.imageUrls?.[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80'}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1.5">
                  {p.verified
                    ? <span className="badge badge-success gap-1 text-xs"><Shield className="w-3 h-3" />Verified</span>
                    : <span className="badge badge-warning text-xs">Pending</span>}
                  {!p.available && <span className="badge badge-neutral text-xs">Unavailable</span>}
                </div>
              </div>

              <h3 className="font-semibold text-stone-900 text-sm mb-1 truncate">{p.title}</h3>
              <p className="text-xs text-stone-500 mb-1">{p.city}, {p.state}</p>
              <p className="text-xs text-stone-400 mb-3">Owner: {p.owner?.fullName}</p>

              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-primary-600">{formatCurrency(p.monthlyRent)}/mo</span>
                <span className="text-xs text-stone-400">{p.bhk} BHK</span>
              </div>

              <div className="flex gap-2">
                <Link to={`/properties/${p.id}`} className="btn btn-outline btn-sm flex-1 gap-1">
                  <Eye className="w-3.5 h-3.5" /> View
                </Link>
                {!p.verified && (
                  <button onClick={() => handleVerify(p.id)} className="btn btn-success btn-sm flex-1 gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verify
                  </button>
                )}
                <button
                  onClick={() => setRemoveModal(p)}
                  className="btn btn-sm gap-1 text-red-500 border border-red-100 hover:bg-red-50 px-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={total} onPageChange={setPage} />

      {/* Remove modal */}
      <Modal isOpen={!!removeModal} onClose={() => setRemoveModal(null)} title="Remove Property" size="sm">
        <p className="text-stone-600 mb-3">
          Remove <strong>{removeModal?.title}</strong>? Please provide a reason:
        </p>
        <textarea
          className="input resize-none mb-4"
          rows={3}
          placeholder="Reason for removal (fake listing, policy violation, etc.)…"
          value={reason}
          onChange={e => setReason(e.target.value)}
        />
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleRemove} className="flex-1" disabled={!reason.trim()}>
            Remove Property
          </Button>
          <Button variant="outline" onClick={() => setRemoveModal(null)} className="flex-1">Cancel</Button>
        </div>
      </Modal>
    </div>
  )
}

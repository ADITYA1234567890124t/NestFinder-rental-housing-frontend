import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOwnerProperties, deleteProperty } from '@/redux/slices/propertySlice'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Shield } from 'lucide-react'
import { formatCurrency } from '@/utils/formatCurrency'
import Loader from '@/components/common/Loader'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import propertyApi from '@/api/propertyApi'
import toast from 'react-hot-toast'

export default function MyProperties() {
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const { ownerList, loading } = useSelector(s => s.property)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => { if (user?.id) dispatch(fetchOwnerProperties({ ownerId: user.id, params: { page:0, size:50 } })) }, [dispatch, user])

  const handleDelete = async () => {
    await dispatch(deleteProperty(deleteId))
    setDeleteId(null)
    toast.success('Property deleted')
  }

  const toggleAvail = async (id) => {
    await propertyApi.toggleAvail(id)
    dispatch(fetchOwnerProperties({ ownerId: user.id, params: { page:0, size:50 } }))
    toast.success('Availability updated')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-semibold text-stone-900">My Properties</h1>
        <Link to="/owner/properties/add" className="btn btn-primary gap-2"><Plus className="w-4 h-4" />Add Property</Link>
      </div>

      {loading ? <Loader /> : ownerList.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-stone-500 mb-4">You haven't listed any properties yet.</p>
          <Link to="/owner/properties/add" className="btn btn-primary">Add Your First Property</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {ownerList.map(p => (
            <div key={p.id} className="card p-5 flex gap-4">
              <img src={p.imageUrls?.[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200&q=80'} className="w-24 h-24 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-stone-900">{p.title}</h3>
                    <p className="text-sm text-stone-500">{p.city}, {p.state}</p>
                    <p className="text-primary-600 font-semibold mt-1">{formatCurrency(p.monthlyRent)}/mo</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {p.verified && <span className="badge badge-success gap-1 text-xs"><Shield className="w-3 h-3" />Verified</span>}
                    <span className={`badge ${p.available ? 'badge-success' : 'badge-neutral'} text-xs`}>{p.available ? 'Available' : 'Unavailable'}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Link to={`/owner/properties/edit/${p.id}`} className="btn btn-outline btn-sm gap-1"><Edit2 className="w-3.5 h-3.5" />Edit</Link>
                  <button onClick={() => toggleAvail(p.id)} className="btn btn-outline btn-sm gap-1">
                    {p.available ? <ToggleLeft className="w-3.5 h-3.5" /> : <ToggleRight className="w-3.5 h-3.5" />}
                    {p.available ? 'Mark Unavailable' : 'Mark Available'}
                  </button>
                  <button onClick={() => setDeleteId(p.id)} className="btn btn-sm gap-1 text-red-500 hover:bg-red-50 border border-red-100">
                    <Trash2 className="w-3.5 h-3.5" />Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Property" size="sm">
        <p className="text-stone-600 mb-6">Are you sure you want to delete this property? This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleDelete} className="flex-1">Delete</Button>
          <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
        </div>
      </Modal>
    </div>
  )
}

import { useEffect, useState } from 'react'
import api from '@/api/axiosConfig'
import Loader from '@/components/common/Loader'
import Pagination from '@/components/common/Pagination'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import { formatDate } from '@/utils/dateFormatter'
import { getInitials } from '@/utils/validators'
import { UserX, UserCheck, Search, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export default function ManageUsers() {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(0)
  const [total,   setTotal]   = useState(0)
  const [search,  setSearch]  = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [confirmModal, setConfirmModal] = useState(null) // { user, action }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/admin/users', { params: { page, size: 15 } })
      setUsers(data.data?.content || [])
      setTotal(data.data?.totalPages || 0)
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [page])

  const handleBan = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/ban`)
      toast.success('User banned')
      fetchUsers()
    } catch { toast.error('Failed to ban user') }
    setConfirmModal(null)
  }

  const handleUnban = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/unban`)
      toast.success('User unbanned')
      fetchUsers()
    } catch { toast.error('Failed to unban user') }
    setConfirmModal(null)
  }

  const roleColor = { TENANT: 'badge-info', OWNER: 'badge-primary', ADMIN: 'badge-warning' }

  const filtered = users.filter(u => {
    const matchSearch = search === '' || u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    const matchRole   = roleFilter === 'ALL' || u.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-stone-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary-500" /> Manage Users
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">{users.length} users loaded</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
       
        <div className="flex gap-2">
          {['ALL', 'TENANT', 'OWNER', 'ADMIN'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={clsx('btn btn-sm', roleFilter === r ? 'btn-primary' : 'btn-outline')}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Loader /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-medium text-stone-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-sm font-semibold shrink-0">
                          {getInitials(u.fullName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-stone-900 truncate">{u.fullName}</p>
                          <p className="text-xs text-stone-400">{u.city || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-stone-600 truncate max-w-[180px]">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${roleColor[u.role] || 'badge-neutral'}`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${u.enabled ? 'badge-success' : 'badge-error'}`}>
                        {u.enabled ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-stone-500 text-xs">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-4">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => setConfirmModal({ user: u, action: u.enabled ? 'ban' : 'unban' })}
                          className={clsx(
                            'btn btn-sm gap-1',
                            u.enabled
                              ? 'text-red-500 border border-red-100 hover:bg-red-50'
                              : 'text-emerald-600 border border-emerald-100 hover:bg-emerald-50'
                          )}
                        >
                          {u.enabled
                            ? <><UserX className="w-3.5 h-3.5" /> Ban</>
                            : <><UserCheck className="w-3.5 h-3.5" /> Unban</>}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination currentPage={page} totalPages={total} onPageChange={setPage} />

      {/* Confirm modal */}
      <Modal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        title={`${confirmModal?.action === 'ban' ? 'Ban' : 'Unban'} User`}
        size="sm"
      >
        <p className="text-stone-600 mb-6">
          Are you sure you want to {confirmModal?.action} <strong>{confirmModal?.user?.fullName}</strong>?
          {confirmModal?.action === 'ban' && ' They will not be able to login.'}
        </p>
        <div className="flex gap-3">
          <Button
            variant={confirmModal?.action === 'ban' ? 'danger' : 'success'}
            onClick={() => confirmModal?.action === 'ban'
              ? handleBan(confirmModal.user.id)
              : handleUnban(confirmModal.user.id)}
            className="flex-1"
          >
            Confirm {confirmModal?.action === 'ban' ? 'Ban' : 'Unban'}
          </Button>
          <Button variant="outline" onClick={() => setConfirmModal(null)} className="flex-1">Cancel</Button>
        </div>
      </Modal>
    </div>
  )
}

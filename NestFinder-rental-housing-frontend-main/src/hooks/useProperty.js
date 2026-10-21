import { useDispatch, useSelector } from 'react-redux'
import { fetchProperties, fetchPropertyById, fetchOwnerProperties, createProperty, updateProperty, deleteProperty, searchProperties } from '@/redux/slices/propertySlice'
import { useCallback } from 'react'
import toast from 'react-hot-toast'

export function useProperty() {
  const dispatch = useDispatch()
  const { list, selected, ownerList, searchResults, loading, error, totalPages } = useSelector(s => s.property)

  const getAll     = useCallback((p) => dispatch(fetchProperties(p)), [dispatch])
  const getById    = useCallback((id) => dispatch(fetchPropertyById(id)), [dispatch])
  const getByOwner = useCallback((id, p) => dispatch(fetchOwnerProperties({ ownerId: id, params: p })), [dispatch])
  const search     = useCallback((p) => dispatch(searchProperties(p)), [dispatch])

  const create = async (data) => {
    const r = await dispatch(createProperty(data))
    if (r.meta.requestStatus === 'fulfilled') { toast.success('Property created!'); return r.payload }
    toast.error(r.payload || 'Failed'); return null
  }

  const update = async (id, data) => {
    const r = await dispatch(updateProperty({ id, formData: data }))
    if (r.meta.requestStatus === 'fulfilled') { toast.success('Property updated!'); return r.payload }
    toast.error(r.payload || 'Failed'); return null
  }

  const remove = async (id) => {
    const r = await dispatch(deleteProperty(id))
    if (r.meta.requestStatus === 'fulfilled') { toast.success('Property deleted'); return true }
    toast.error(r.payload || 'Failed'); return false
  }

  return { list, selected, ownerList, searchResults, loading, error, totalPages, getAll, getById, getByOwner, search, create, update, remove }
}

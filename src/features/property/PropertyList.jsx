import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProperties, searchProperties } from '@/redux/slices/propertySlice'
import PropertyGrid   from '@/components/property/PropertyGrid'
import PropertyFilter from '@/components/property/PropertyFilter'
import Pagination     from '@/components/common/Pagination'

export default function PropertyList() {
  const dispatch = useDispatch()
  const { list, loading, totalPages } = useSelector(s => s.property)
  const [page, setPage] = useState(0)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    dispatch(fetchProperties({ page, size: 9, sortBy: 'createdAt', sortDir: 'desc', ...filters }))
  }, [dispatch, page, filters])

  const handleFilter = (f) => { setFilters(f); setPage(0) }

  return (
    <div className="py-8">
      <div className="page-container">
        <div className="mb-8">
          <h1 className="section-title mb-2">All Properties</h1>
          <p className="text-stone-500">Discover your perfect rental home</p>
        </div>
        <div className="mb-6"><PropertyFilter onFilter={handleFilter} loading={loading} /></div>
        <PropertyGrid properties={list} loading={loading} cols={3} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  )
}

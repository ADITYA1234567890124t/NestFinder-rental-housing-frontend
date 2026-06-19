import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchProperties } from '@/redux/slices/propertySlice'
import PropertyGrid   from '@/components/property/PropertyGrid'
import PropertyFilter from '@/components/property/PropertyFilter'
import SearchBar      from '@/components/common/SearchBar'
import Pagination     from '@/components/common/Pagination'
import { useSearchParams } from 'react-router-dom'

export default function SearchProperty() {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const { searchResults, loading, totalPages } = useSelector(s => s.property)
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [filters, setFilters] = useState({})

  useEffect(() => {
    if (query) dispatch(searchProperties({ query, page, size: 9, ...filters }))
    else dispatch(searchProperties({ page, size: 9, ...filters }))
  }, [dispatch, query, page, filters])

  return (
    <div className="py-8">
      <div className="page-container">
        <div className="mb-8">
          <h1 className="section-title mb-4">Search Properties</h1>
          <SearchBar defaultValue={query} placeholder="Search by city, area, property name..." onSearch={q => { setQuery(q); setPage(0) }} />
        </div>
        <div className="mb-6"><PropertyFilter onFilter={f => { setFilters(f); setPage(0) }} loading={loading} /></div>
        {query && <p className="text-stone-500 text-sm mb-4">Results for "<strong>{query}</strong>"</p>}
        <PropertyGrid properties={searchResults} loading={loading} cols={3} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  )
}

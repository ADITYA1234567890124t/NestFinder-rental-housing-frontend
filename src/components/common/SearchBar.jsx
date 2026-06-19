import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function SearchBar({ placeholder = 'Search...', onSearch, className = '', defaultValue = '' }) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const handle = (e) => {
    e.preventDefault()
    onSearch?.(value.trim())
  }

  return (
    <form onSubmit={handle} className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="input pl-10 pr-10"
        />
        {value && (
          <button type="button" onClick={() => { setValue(''); onSearch?.('') }} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <button type="submit" className="btn btn-primary px-5">Search</button>
    </form>
  )
}

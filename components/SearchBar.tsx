'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onSearch?: (query: string) => void
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search...",
  onSearch 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(value)
    }
  }

  const clearSearch = () => {
    onChange('')
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className={`relative flex items-center bg-white rounded-xl shadow-lg transition-all duration-200 ${
        isFocused ? 'ring-2 ring-primary-500 shadow-xl' : ''
      }`}>
        <div className="absolute left-4 text-gray-400">
          <Search className="h-5 w-5" />
        </div>
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 text-gray-900 placeholder-gray-500 bg-transparent border-0 rounded-xl focus:outline-none focus:ring-0"
        />
        
        {value && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {value && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-10">
          <div className="p-4">
            <p className="text-sm text-gray-600">
              Press Enter to search for "{value}"
            </p>
          </div>
        </div>
      )}
    </form>
  )
}



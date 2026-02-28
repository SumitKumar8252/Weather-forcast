import { useState, useEffect, useCallback } from 'react'
import weatherAPI from '../features/weather/weatherAPI'

export const useSearch = () => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [searching, setSearching] = useState(false)

  const search = useCallback(async (q) => {
    if (q.length < 2) {
      setSuggestions([])
      return
    }
    setSearching(true)
    try {
      const results = await weatherAPI.searchCities(q)
      setSuggestions(results.map((r) => ({
        name: r.name,
        country: r.country,
        state: r.state,
        display: [r.name, r.state, r.country].filter(Boolean).join(', '),
      })))
    } catch {
      setSuggestions([])
    } finally {
      setSearching(false)
    }
  }, [])

  // Debounce: only call API 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => search(query), 300)
    return () => clearTimeout(timer)
  }, [query, search])

  const clear = () => {
    setQuery('')
    setSuggestions([])
  }

  return { query, setQuery, suggestions, searching, clear }
}

export default useSearch

import { useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function useQueryState(defaults = {}) {
  const navigate = useNavigate()
  const location = useLocation()

  const params = new URLSearchParams(location.search)
  const values = { ...defaults }

  params.forEach((value, key) => {
    if (value === undefined || value === null || value === '') return
    if (values[key]) {
      // convert CSV back to array
      values[key] = value.includes(',') ? value.split(',') : value
    } else {
      values[key] = value
    }
  })

  const setQuery = useCallback(
    (nextValues, options = {}) => {
      const opts = { replace: true, ...options }
      const merged = { ...defaults }
      const current = new URLSearchParams(location.search)
      current.forEach((value, key) => {
        merged[key] = value
      })

      Object.entries(nextValues).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
          delete merged[key]
        } else {
          merged[key] = Array.isArray(value) ? value.join(',') : value
        }
      })

      const search = new URLSearchParams(merged).toString()
      const currentSearch = location.search?.replace(/^\?/, '') || ''
      if (search === currentSearch) return
      navigate({ pathname: location.pathname, search: search ? `?${search}` : '' }, opts)
    },
    [defaults, navigate, location.pathname, location.search],
  )

  return [values, setQuery]
}

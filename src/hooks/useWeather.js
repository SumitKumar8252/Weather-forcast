import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCityWeather, selectCityWeather, selectCityLoading, selectCityError } from '../features/weather/weatherSlice'

const REFRESH_INTERVAL = 60 * 1000 // 60 seconds

export const useWeather = (city) => {
  const dispatch = useDispatch()
  const data = useSelector(selectCityWeather(city))
  const loading = useSelector(selectCityLoading(city))
  const error = useSelector(selectCityError(city))

  const fetch = useCallback(() => {
    if (city) dispatch(fetchCityWeather(city))
  }, [city, dispatch])

  // Initial fetch
  useEffect(() => {
    fetch()
  }, [fetch])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetch, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetch])

  return { data, loading, error, refresh: fetch }
}

export default useWeather

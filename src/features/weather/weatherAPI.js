import axios from 'axios'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0'

const api = axios.create({ baseURL: BASE_URL })

export const weatherAPI = {
  // Current weather for a city
  getCurrent: async (city) => {
    const { data } = await api.get('/weather', {
      params: { q: city, appid: API_KEY, units: 'metric' },
    })
    return data
  },

  // 5-day / 3-hour forecast
  getForecast: async (city) => {
    const { data } = await api.get('/forecast', {
      params: { q: city, appid: API_KEY, units: 'metric' },
    })
    return data
  },

  // City autocomplete suggestions
  searchCities: async (query) => {
    const { data } = await axios.get(`${GEO_URL}/direct`, {
      params: { q: query, limit: 5, appid: API_KEY },
    })
    return data
  },

  // UV Index from coords (free-tier endpoint)
  getUVI: async (lat, lon) => {
    const { data } = await api.get('/uvi', {
      params: { lat, lon, appid: API_KEY },
    })
    return data.value ?? null
  },
}

export default weatherAPI

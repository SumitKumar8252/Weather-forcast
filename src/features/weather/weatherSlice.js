import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import weatherAPI from './weatherAPI'

const CACHE_DURATION = 60 * 1000 // 60 seconds

// Fetch current + forecast + UV together, with cache check
export const fetchCityWeather = createAsyncThunk(
  'weather/fetchCity',
  async (city, { getState, rejectWithValue }) => {
    try {
      const existing = getState().weather.cities[city]
      const now = Date.now()

      // Return cached data if fresh (< 60s old)
      if (existing && now - existing.lastFetched < CACHE_DURATION) {
        return null // signals "use cache"
      }

      const [current, forecast] = await Promise.all([
        weatherAPI.getCurrent(city),
        weatherAPI.getForecast(city),
      ])

      // Fetch UV index using coordinates from current weather
      let uvi = null
      try {
        uvi = await weatherAPI.getUVI(current.coord.lat, current.coord.lon)
      } catch {
        // UV fetch is non-critical — fail silently
      }

      return { city, current, forecast: forecast.list, uvi, lastFetched: now }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch weather')
    }
  }
)

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    cities: {},   // { "London": { current, forecast, uvi, lastFetched } }
    loading: {},  // { "London": true/false }
    errors: {},   // { "London": "error message" }
  },
  reducers: {
    clearError(state, action) {
      delete state.errors[action.payload]
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCityWeather.pending, (state, action) => {
        const city = action.meta.arg
        state.loading[city] = true
        delete state.errors[city]
      })
      .addCase(fetchCityWeather.fulfilled, (state, action) => {
        const city = action.meta.arg
        state.loading[city] = false
        if (action.payload) {
          state.cities[city] = {
            current:     action.payload.current,
            forecast:    action.payload.forecast,
            uvi:         action.payload.uvi,
            lastFetched: action.payload.lastFetched,
          }
        }
      })
      .addCase(fetchCityWeather.rejected, (state, action) => {
        const city = action.meta.arg
        state.loading[city] = false
        state.errors[city] = action.payload
      })
  },
})

export const { clearError } = weatherSlice.actions
export default weatherSlice.reducer

// Selectors
export const selectCityWeather  = (city) => (state) => state.weather.cities[city]
export const selectCityLoading  = (city) => (state) => state.weather.loading[city]
export const selectCityError    = (city) => (state) => state.weather.errors[city]

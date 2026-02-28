import { configureStore } from '@reduxjs/toolkit'
import weatherReducer from '../features/weather/weatherSlice'
import favoritesReducer from '../features/favorites/favoritesSlice'
import settingsReducer from '../features/settings/settingsSlice'
import authReducer from '../features/auth/authSlice'

// Load persisted state from localStorage
const loadState = () => {
  try {
    const favorites = localStorage.getItem('weather_favorites')
    const settings = localStorage.getItem('weather_settings')
    return {
      favorites: favorites ? JSON.parse(favorites) : undefined,
      settings: settings ? JSON.parse(settings) : undefined,
    }
  } catch {
    return {}
  }
}

const preloadedState = loadState()

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    favorites: favoritesReducer,
    settings: settingsReducer,
    auth: authReducer,
  },
  preloadedState,
})

// Persist favorites and settings on every state change
store.subscribe(() => {
  const state = store.getState()
  localStorage.setItem('weather_favorites', JSON.stringify(state.favorites))
  localStorage.setItem('weather_settings', JSON.stringify(state.settings))
})

export default store

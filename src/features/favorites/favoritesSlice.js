import { createSlice } from '@reduxjs/toolkit'

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    list: ['London', 'New York', 'Tokyo'], // default cities
  },
  reducers: {
    addFavorite(state, action) {
      const city = action.payload
      if (!state.list.includes(city)) {
        state.list.push(city)
      }
    },
    removeFavorite(state, action) {
      state.list = state.list.filter((c) => c !== action.payload)
    },
    reorderFavorites(state, action) {
      state.list = action.payload
    },
  },
})

export const { addFavorite, removeFavorite, reorderFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer

export const selectFavorites = (state) => state.favorites.list

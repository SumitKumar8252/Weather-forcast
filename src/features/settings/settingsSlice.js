import { createSlice } from '@reduxjs/toolkit'

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    unit: 'celsius', // 'celsius' | 'fahrenheit'
  },
  reducers: {
    toggleUnit(state) {
      state.unit = state.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
    setUnit(state, action) {
      state.unit = action.payload
    },
  },
})

export const { toggleUnit, setUnit } = settingsSlice.actions
export default settingsSlice.reducer

export const selectUnit = (state) => state.settings.unit

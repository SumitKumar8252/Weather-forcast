import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user:    null,
  loading: false,  // false so ProtectedRoute doesn't hang waiting for Firebase
  error:   null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user    = action.payload
      state.loading = false
      state.error   = null
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error   = action.payload
      state.loading = false
    },
    clearAuth(state) {
      state.user    = null
      state.loading = false
      state.error   = null
    },
  },
})

export const { setUser, setLoading, setError, clearAuth } = authSlice.actions

export const selectUser        = (state) => state.auth.user
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError   = (state) => state.auth.error

export default authSlice.reducer

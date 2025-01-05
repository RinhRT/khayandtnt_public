import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isFetching: false,
    error: false
  },
  
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload
      state.isFetching = false
      state.error = false
    },
    loginFail: (state) => {
      state.isFetching = false
      state.error = true
    },
    loginStart: (state) => {
      state.isFetching = true
    },
    logoutSuccess: (state) => {
      state.user = null
      state.isFetching = false
    },
  },
})

export const { loginFail, loginStart, loginSuccess, logoutSuccess } = authSlice.actions
export default authSlice.reducer

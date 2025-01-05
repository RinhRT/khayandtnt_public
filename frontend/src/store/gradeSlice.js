import { createSlice } from '@reduxjs/toolkit'

export const gradeSlice = createSlice({
    name: 'grades',
    initialState: {
        data: [],
        isFetching: false,
        error: false
    },

    reducers: {
        gradeStart: (state) => {
            state.isFetching = true
        },
        gradeFail: (state) => {
            state.isFetching = false
            state.error = true
        },
        gradeSuccess: (state, action) => {
            state.isFetching = false
            state.error = false
            state.data = action.payload
        },
    }
})

export const { gradeStart, gradeFail, gradeSuccess } = gradeSlice.actions
export default gradeSlice.reducer
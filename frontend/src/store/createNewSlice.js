import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../api/axiosInstance'

export const createNew = createAsyncThunk(
    'create/createNew',
    async (data, { rejectWithValue }) => {
        const { path, ...other } = data
        try {
            const response = await axiosInstance.post(path, {...other})

            return response.data
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

const createNewSlice = createSlice({
    name: 'create',
    initialState: {
        data: null,
        isLoading: false,
        error: false
    },
    reducers: {},
    extraReducers: (builder) => { 
        builder
        .addCase(createNew.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(createNew.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
        })
        .addCase(createNew.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
    }
})

export default createNewSlice.reducer
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../api/axiosInstance'

export const uploadFile = createAsyncThunk(
    'upload/uploadFile',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData()
            formData.append('file', data.file)

            const response = await axiosInstance.post(data.path, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            return response.data
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

const uploadSlice = createSlice({
    name: 'upload',
    initialState: {
        data: null,
        isLoading: false,
        error: false
    },
    reducers: {},
    extraReducers: (builder) => { 
        builder
        .addCase(uploadFile.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(uploadFile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
        })
        .addCase(uploadFile.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
    }
})

export default uploadSlice.reducer
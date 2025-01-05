import { createSlice } from "@reduxjs/toolkit";

// Slice
const traySlice = createSlice({
  name: "trays",
  initialState: {
    data: [],
    isFetching: false,
    error: null,  // Error now holds error message or object
  },
  reducers: {
    // Get tray
    getTrayStart: (state) => {
      state.isFetching = true;
      state.error = null;  // Clear previous errors if any
    },
    getTrayFail: (state, action) => {
      state.isFetching = false;
      state.error = action.payload || "An error occurred while fetching trays";  // Handle error messages
    },
    getTraySuccess: (state, action) => {
      state.isFetching = false;
      state.error = null;  // Clear error on success
      state.data = action.payload;  // Update trays with fetched data
    }
  }
});

export const { 
  getTrayStart,
  getTrayFail,
  getTraySuccess
} = traySlice.actions;

export default traySlice.reducer;

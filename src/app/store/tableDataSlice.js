import { createSlice } from '@reduxjs/toolkit';

export const tableSlice = createSlice({
  name: 'table',
  initialState: {
    tableData: [],
    selectedLocation: [],
  },
  reducers: {
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
  },
});

export const { setTableData, setSelectedLocation } = tableSlice.actions;

export default tableSlice.reducer;

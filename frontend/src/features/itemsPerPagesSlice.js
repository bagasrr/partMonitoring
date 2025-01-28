import { createSlice } from "@reduxjs/toolkit";

const initialState = 10;

const itemsPerPageSlice = createSlice({
  name: "itemsPerPage",
  initialState,
  reducers: {
    setItemsPerPage: (state, action) => action.payload,
  },
});

export const { setItemsPerPage } = itemsPerPageSlice.actions;
export default itemsPerPageSlice.reducer;

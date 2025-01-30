import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  deleted: false,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.message = action.payload;
    },
    clearNotification: (state) => {
      state.message = "";
    },
    setDeleted: (state, action) => {
      state.deleted = action.payload;
    },
    clearDeleted: (state) => {
      state.deleted = false;
    },
  },
});

export const { setNotification, clearNotification, setDeleted, clearDeleted } = notificationSlice.actions;
export default notificationSlice.reducer;

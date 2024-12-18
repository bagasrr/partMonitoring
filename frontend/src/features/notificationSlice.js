import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
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
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

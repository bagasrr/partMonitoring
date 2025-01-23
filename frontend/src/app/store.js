import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import notificationReducer from "../features/notificationSlice";
import itemsPerPageReducer from "../features/itemsPerPagesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    itemsPerPage: itemsPerPageReducer,
  },
});

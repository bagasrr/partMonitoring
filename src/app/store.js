import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/AuthSlice";
import notificationReducer from "../features/notificationSlice";
import itemsPerPageReducer from "../features/itemsPerPagesSlice";
import sidebarReducer from "../features/sidebarSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    itemsPerPage: itemsPerPageReducer,
    sidebar: sidebarReducer,
  },
});

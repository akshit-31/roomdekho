import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { notificationApi } from "../../services/api/notification.api";

export const fetchNotifications = createAsyncThunk("notification/fetch", async () => {
  const { data } = await notificationApi.list();
  return data.data;
});

const notificationSlice = createSlice({
  name: "notification",
  initialState: { items: [], unreadCount: 0 },
  reducers: {
    pushNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAllReadLocal: (state) => {
      state.unreadCount = 0;
      state.items = state.items.map((n) => ({ ...n, read: true }));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    });
  },
});

export const { pushNotification, markAllReadLocal } = notificationSlice.actions;
export default notificationSlice.reducer;

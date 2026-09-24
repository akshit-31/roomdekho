import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../../services/api/user.api";

export const fetchMe = createAsyncThunk("user/fetchMe", async () => {
  const { data } = await userApi.me();
  return data.data;
});

export const updateProfile = createAsyncThunk("user/updateProfile", async (payload) => {
  const { data } = await userApi.updateProfile(payload);
  return data.data;
});

const userSlice = createSlice({
  name: "user",
  initialState: { profile: null, status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => { state.status = "loading"; })
      .addCase(fetchMe.fulfilled, (state, action) => { state.profile = action.payload; state.status = "succeeded"; })
      .addCase(fetchMe.rejected, (state) => { state.status = "failed"; })
      .addCase(updateProfile.fulfilled, (state, action) => { state.profile = action.payload; });
  },
});

export default userSlice.reducer;

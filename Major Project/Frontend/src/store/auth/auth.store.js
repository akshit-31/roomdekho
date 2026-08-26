import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../services/api/auth.api";
import { getErrorMessage } from "../../utils/errorHandler";

export const login = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authApi.login(payload);
    return data.data; // { accessToken, user }
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const register = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authApi.register(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const logoutAsync = createAsyncThunk("auth/logoutAsync", async () => {
  await authApi.logout();
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, accessToken: null, status: "idle", error: null },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; })
      .addCase(logoutAsync.fulfilled, (state) => { state.user = null; state.accessToken = null; });
  },
});

export const { setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;

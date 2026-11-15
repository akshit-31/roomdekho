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

export const checkSession = createAsyncThunk("auth/checkSession", async (_, { rejectWithValue }) => {
  try {
    const { data } = await authApi.refresh();
    return data.data;
  } catch (err) {
    return rejectWithValue(null);
  }
});

const savedToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || null : null;
let savedUser = null;
try {
  savedUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
} catch {}

const initialState = {
  user: savedUser,
  accessToken: savedToken,
  status: savedToken ? "succeeded" : "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      try {
        if (action.payload) {
          localStorage.setItem("accessToken", action.payload);
        } else {
          localStorage.removeItem("accessToken");
        }
      } catch {}
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = "idle";
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      } catch {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        try {
          localStorage.setItem("accessToken", action.payload.accessToken);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        } catch {}
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload?.accessToken) {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          try {
            localStorage.setItem("accessToken", action.payload.accessToken);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
          } catch {}
        }
      })
      .addCase(register.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; })
      .addCase(login.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.status = "idle";
        state.error = null;
        try {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        } catch {}
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.status = "idle";
        try {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        } catch {}
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        if (action.payload?.accessToken) {
          state.accessToken = action.payload.accessToken;
          if (action.payload.user) {
            state.user = action.payload.user;
            try {
              localStorage.setItem("user", JSON.stringify(action.payload.user));
            } catch {}
          }
          try {
            localStorage.setItem("accessToken", action.payload.accessToken);
          } catch {}
          state.status = "succeeded";
        } else {
          state.user = null;
          state.accessToken = null;
          state.status = "idle";
          try {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
          } catch {}
        }
      })
      .addCase(checkSession.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.status = "idle";
        try {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        } catch {}
      });
  },
});

export const { setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;

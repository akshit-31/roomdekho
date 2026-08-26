import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { matchApi } from "../../services/api/match.api";

export const fetchTopMatches = createAsyncThunk("match/fetchTop", async (limit) => {
  const { data } = await matchApi.topMatches(limit);
  return data.data;
});

const matchSlice = createSlice({
  name: "match",
  initialState: { topMatches: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTopMatches.fulfilled, (state, action) => { state.topMatches = action.payload; });
  },
});

export default matchSlice.reducer;

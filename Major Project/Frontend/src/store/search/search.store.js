import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchApi } from "../../services/api/search.api";

export const runSearch = createAsyncThunk("search/run", async (params) => {
  const { data } = await searchApi.searchRooms(params);
  return data.data;
});

const searchSlice = createSlice({
  name: "search",
  initialState: { filters: {}, results: { items: [], total: 0 }, status: "idle" },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    resetFilters: (state) => { state.filters = {}; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runSearch.pending, (state) => { state.status = "loading"; })
      .addCase(runSearch.fulfilled, (state, action) => { state.status = "succeeded"; state.results = action.payload; });
  },
});

export const { setFilters, resetFilters } = searchSlice.actions;
export default searchSlice.reducer;

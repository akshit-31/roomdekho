import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { propertyApi } from "../../services/api/property.api";

export const fetchRoom = createAsyncThunk("property/fetchRoom", async (id) => {
  const { data } = await propertyApi.getOne(id);
  return data.data;
});

export const fetchMyListings = createAsyncThunk("property/fetchMyListings", async (params) => {
  const { data } = await propertyApi.mine(params);
  return data.data;
});

const propertySlice = createSlice({
  name: "property",
  initialState: { current: null, myListings: { items: [], total: 0 }, status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoom.fulfilled, (state, action) => { state.current = action.payload; })
      .addCase(fetchMyListings.fulfilled, (state, action) => { state.myListings = action.payload; });
  },
});

export default propertySlice.reducer;

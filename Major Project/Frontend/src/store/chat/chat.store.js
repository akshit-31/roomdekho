import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chatApi } from "../../services/api/chat.api";

export const fetchConversations = createAsyncThunk("chat/fetchConversations", async () => {
  const { data } = await chatApi.listConversations();
  return data.data;
});

export const fetchConversation = createAsyncThunk("chat/fetchConversation", async (id) => {
  const { data } = await chatApi.getConversation(id);
  return data.data;
});

const chatSlice = createSlice({
  name: "chat",
  initialState: { conversations: [], active: null, messages: [], typingUserId: null },
  reducers: {
    appendMessage: (state, action) => { state.messages.push(action.payload); },
    setTyping: (state, action) => { state.typingUserId = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (state, action) => { state.conversations = action.payload; })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.active = action.payload.conversation;
        state.messages = action.payload.messages || [];
      });
  },
});

export const { appendMessage, setTyping } = chatSlice.actions;
export default chatSlice.reducer;

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
    appendMessage: (state, action) => {
      const msg = action.payload;
      if (!msg) return;

      // Ensure the message belongs to the currently active conversation
      const msgConvId = String(msg.conversation_id || msg.conversationId || "");
      const activeConvId = String(state.active?._id || state.active?.id || "");
      if (activeConvId && msgConvId && msgConvId !== activeConvId) {
        return; // Do NOT append messages from other conversations!
      }

      // Prevent duplicate messages in message list
      const msgId = msg._id || msg.id;
      const alreadyExists = state.messages.some(
        (m) => (msgId && (m._id === msgId || m.id === msgId)) ||
               (m.sentAt && msg.sentAt && m.sentAt === msg.sentAt && m.text === msg.text)
      );
      if (!alreadyExists) {
        state.messages.push(msg);
      }

      // Update lastMessage in conversations list
      if (msgConvId) {
        const targetConv = state.conversations.find(
          (c) => String(c._id || c.id) === msgConvId
        );
        if (targetConv) {
          targetConv.lastMessage = msg.body || msg.text || targetConv.lastMessage;
          targetConv.updatedAt = msg.created_at || msg.sentAt || new Date().toISOString();
        }
      }
    },
    clearActiveConversation: (state) => {
      state.active = null;
      state.messages = [];
    },
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

export const { appendMessage, clearActiveConversation, setTyping } = chatSlice.actions;
export default chatSlice.reducer;

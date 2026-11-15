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

      const msgId = String(msg._id || msg.id || "");
      const msgText = msg.text || msg.body || msg.content || "";
      const msgTime = new Date(msg.sentAt || msg.created_at || Date.now()).getTime();

      // Check if message already exists by ID or by text + timestamp within 4s
      const existingIdx = state.messages.findIndex((m) => {
        const existingId = String(m._id || m.id || "");
        if (msgId && existingId && msgId === existingId) return true;
        const existingText = m.text || m.body || m.content || "";
        const existingTime = new Date(m.sentAt || m.created_at || 0).getTime();
        return (
          msgText &&
          existingText === msgText &&
          String(m.senderId || m.sender_id || "") === String(msg.senderId || msg.sender_id || "") &&
          Math.abs(msgTime - existingTime) < 4000
        );
      });

      if (existingIdx !== -1) {
        state.messages[existingIdx] = { ...state.messages[existingIdx], ...msg };
      } else {
        state.messages.push(msg);
      }

      // Keep messages sorted chronologically
      state.messages.sort(
        (a, b) =>
          new Date(a.sentAt || a.created_at || 0).getTime() -
          new Date(b.sentAt || b.created_at || 0).getTime()
      );

      // Update lastMessage and bump conversation to top
      if (msgConvId) {
        const convIdx = state.conversations.findIndex(
          (c) => String(c._id || c.id) === msgConvId
        );
        if (convIdx !== -1) {
          const updatedConv = {
            ...state.conversations[convIdx],
            lastMessage: msgText || state.conversations[convIdx].lastMessage,
            updatedAt: msg.created_at || msg.sentAt || new Date().toISOString(),
          };
          state.conversations.splice(convIdx, 1);
          state.conversations.unshift(updatedConv);
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

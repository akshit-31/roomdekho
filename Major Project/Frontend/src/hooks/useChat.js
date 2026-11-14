import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchConversations,
  fetchConversation,
  appendMessage,
  clearActiveConversation,
  setTyping
} from "../store/chat/chat.store";
import {
  joinConversation,
  leaveConversation,
  onNewMessage,
  onTyping,
  sendMessageRealtime
} from "../socket/chat.socket";
import { chatApi } from "../services/api/chat.api";

export function useChat(conversationId) {
  const dispatch = useDispatch();
  const { conversations, active, messages, typingUserId } = useSelector((s) => s.chat);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    if (!conversationId) {
      dispatch(clearActiveConversation());
      return;
    }

    // Immediately clear previous conversation messages so old chat messages don't show
    dispatch(clearActiveConversation());
    dispatch(fetchConversation(conversationId));
    joinConversation(conversationId);

    const offMsg = onNewMessage((msg) => {
      const msgConvId = String(msg.conversation_id || msg.conversationId || "");
      if (!msgConvId || msgConvId === String(conversationId)) {
        dispatch(appendMessage(msg));
      }
    });

    const offTyping = onTyping(({ userId, isTyping }) => {
      dispatch(setTyping(isTyping ? userId : null));
    });

    return () => {
      leaveConversation(conversationId);
      offMsg();
      offTyping();
    };
  }, [conversationId, dispatch]);

  const send = async (text, imageUrl) => {
    if (!conversationId) return;
    try {
      const { data } = await chatApi.sendMessage(conversationId, { text, imageUrl });
      if (data?.data) {
        dispatch(appendMessage(data.data));
      }
    } catch {
      sendMessageRealtime(conversationId, { text, imageUrl, sentAt: new Date().toISOString() });
    }
  };

  return { conversations, active, messages, typingUserId, send };
}

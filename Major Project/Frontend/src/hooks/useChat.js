import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchConversations, fetchConversation, appendMessage, setTyping } from "../store/chat/chat.store";
import { joinConversation, onNewMessage, onTyping, sendMessageRealtime } from "../socket/chat.socket";
import { chatApi } from "../services/api/chat.api";

export function useChat(conversationId) {
  const dispatch = useDispatch();
  const { conversations, active, messages, typingUserId } = useSelector((s) => s.chat);

  useEffect(() => {
    dispatch(fetchConversations());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!conversationId) return;
    dispatch(fetchConversation(conversationId));
    joinConversation(conversationId);
    const offMsg = onNewMessage((msg) => dispatch(appendMessage(msg)));
    const offTyping = onTyping(({ userId, isTyping }) => dispatch(setTyping(isTyping ? userId : null)));
    return () => {
      offMsg();
      offTyping();
    };
  }, [conversationId]); // eslint-disable-line react-hooks/exhaustive-deps

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

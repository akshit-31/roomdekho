import { getSocket } from "./socket";

export function joinConversation(conversationId) {
  getSocket()?.emit("chat:join", String(conversationId));
}

export function leaveConversation(conversationId) {
  getSocket()?.emit("chat:leave", String(conversationId));
}

export function sendMessageRealtime(conversationId, message) {
  getSocket()?.emit("chat:message", { conversationId: String(conversationId), message });
}

export function onNewMessage(cb) {
  const handler = (msg) => cb(msg);
  getSocket()?.on("chat:message", handler);
  return () => getSocket()?.off("chat:message", handler);
}

export function emitTyping(conversationId, userId, isTyping) {
  getSocket()?.emit("chat:typing", { conversationId: String(conversationId), userId, isTyping });
}

export function onTyping(cb) {
  const handler = (data) => cb(data);
  getSocket()?.on("chat:typing", handler);
  return () => getSocket()?.off("chat:typing", handler);
}

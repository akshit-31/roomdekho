import { getSocket } from "./socket";

export function joinConversation(conversationId) {
  getSocket()?.emit("chat:join", conversationId);
}

export function sendMessageRealtime(conversationId, message) {
  getSocket()?.emit("chat:message", { conversationId, message });
}

export function onNewMessage(cb) {
  getSocket()?.on("chat:message", cb);
  return () => getSocket()?.off("chat:message", cb);
}

export function emitTyping(conversationId, userId, isTyping) {
  getSocket()?.emit("chat:typing", { conversationId, userId, isTyping });
}

export function onTyping(cb) {
  getSocket()?.on("chat:typing", cb);
  return () => getSocket()?.off("chat:typing", cb);
}

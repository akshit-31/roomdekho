import { api } from "./axios";

export const chatApi = {
  listConversations: () => api.get("/chat"),
  createConversation: (userId) => api.post("/chat", { userId }),
  getConversation: (id) => api.get(`/chat/${id}`),
  sendMessage: (id, payload) => api.post(`/chat/${id}/messages`, payload),
  searchMessages: (id, q) => api.get(`/chat/${id}/search`, { params: { q } }),
};

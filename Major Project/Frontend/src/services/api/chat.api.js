import { api } from "./axios";

export const chatApi = {
  listConversations: () => api.get("/chat"),
  getConversation: (id) => api.get(`/chat/${id}`),
  sendMessage: (id, payload) => api.post(`/chat/${id}/messages`, payload),
  searchMessages: (id, q) => api.get(`/chat/${id}/search`, { params: { q } }),
};

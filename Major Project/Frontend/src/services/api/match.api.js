import { api } from "./axios";

export const matchApi = {
  scoreWith: (userId) => api.get(`/match/${userId}`),
  topMatches: (limit = 10) => api.get("/match/top", { params: { limit } }),
  updateStatus: (id, status) => api.patch(`/match/${id}/status`, { status }),
};

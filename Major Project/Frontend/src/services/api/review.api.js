import { api } from "./axios";

export const reviewApi = {
  create: (payload) => api.post("/reviews", payload),
  listForTarget: (targetType, targetId) => api.get(`/reviews/${targetType}/${targetId}`),
  report: (id) => api.post(`/reviews/${id}/report`),
};

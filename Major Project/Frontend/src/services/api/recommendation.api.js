import { api } from "./axios";

export const recommendationApi = {
  home: () => api.get("/recommendations/home"),
  similar: (roomId) => api.get(`/recommendations/similar/${roomId}`),
};

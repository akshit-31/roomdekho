import { api } from "./axios";

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  refresh: () => api.post("/auth/refresh"),
  logout: () => api.post("/auth/logout"),
  submitKyc: (payload) => api.post("/auth/kyc", payload),
};

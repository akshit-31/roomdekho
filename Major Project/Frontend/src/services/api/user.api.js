import { api } from "./axios";

export const userApi = {
  me: () => api.get("/users/me"),
  updateProfile: (payload) => api.put("/users/me", payload),
  getPublicProfile: (id) => api.get(`/users/${id}`),
  listDevices: () => api.get("/users/me/devices"),
  revokeDevice: (deviceId) => api.delete(`/users/me/devices/${deviceId}`),
};

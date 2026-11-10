import { api } from "./axios";

export const propertyApi = {
  list: (params) => api.get("/rooms", { params }),
  create: (payload) => api.post("/rooms", payload),
  uploadMedia: (id, formData) =>
    api.post(`/rooms/${id}/media`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  getOne: (id) => api.get(`/rooms/${id}`),
  update: (id, payload) => api.put(`/rooms/${id}`, payload),
  publish: (id) => api.patch(`/rooms/${id}/publish`),
  markRented: (id) => api.patch(`/rooms/${id}/rented`),
  remove: (id) => api.delete(`/rooms/${id}`),
  mine: (params) => api.get("/rooms/mine", { params }),
};

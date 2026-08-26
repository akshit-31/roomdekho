import { api } from "./axios";

export const bookingApi = {
  scheduleVisit: (payload) => api.post("/bookings/visits", payload),
  myVisits: () => api.get("/bookings/visits/mine"),
  approve: (id) => api.patch(`/bookings/visits/${id}/approve`),
  reschedule: (id, payload) => api.patch(`/bookings/visits/${id}/reschedule`, payload),
  cancel: (id) => api.patch(`/bookings/visits/${id}/cancel`),
};

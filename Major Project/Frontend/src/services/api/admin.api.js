import { api } from "./axios";

export const adminApi = {
  users: (params) => api.get("/admin/users", { params }),
  banUser: (id, reason) => api.patch(`/admin/users/${id}/ban`, { reason }),
  listings: (params) => api.get("/admin/listings", { params }),
  moderateListing: (id, action) => api.patch(`/admin/listings/${id}/moderate`, { action }),
  kycQueue: () => api.get("/admin/kyc"),
  reviewKyc: (userId, payload) => api.patch(`/admin/kyc/${userId}`, payload),
  reports: () => api.get("/admin/reports"),
  analytics: () => api.get("/analytics/overview"),
  fraudAlerts: (params) => api.get("/admin/fraud-alerts", { params }),
  resolveFraudAlert: (id) => api.patch(`/admin/fraud-alerts/${id}/resolve`),
};

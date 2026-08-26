import { api } from "./axios";

export const ownerApi = {
  dashboard: () => api.get("/owner/dashboard"),
  enquiries: () => api.get("/owner/enquiries"),
};

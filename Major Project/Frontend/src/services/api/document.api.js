import { api } from "./axios";

export const documentApi = {
  generateAgreement: (payload) => api.post("/documents/agreement", payload),
  list: () => api.get("/documents"),
  download: (id) => api.get(`/documents/${id}/download`, { responseType: "blob" }),
};

import { api } from "./axios";

export const paymentApi = {
  createOrder: (payload) => api.post("/payments/orders", payload),
  verify: (payload) => api.post("/payments/verify", payload),
  history: () => api.get("/payments/history"),
};

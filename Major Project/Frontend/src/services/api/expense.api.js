import { api } from "./axios";

export const expenseApi = {
  calculateRent: (payload) => api.post("/expenses/rent-calculator", payload),
  split: (payload) => api.post("/expenses/split", payload),
  myExpenses: () => api.get("/expenses/mine"),
  markPaid: (id) => api.patch(`/expenses/${id}/paid`),
};

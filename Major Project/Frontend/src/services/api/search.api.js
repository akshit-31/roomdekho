import { api } from "./axios";

export const searchApi = {
  searchRooms: (params) => api.get("/rooms", { params }),
};

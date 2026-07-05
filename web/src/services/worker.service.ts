import api from "../api/axios";

export const workerService = {
  list: () => api.get("/workers"),
};

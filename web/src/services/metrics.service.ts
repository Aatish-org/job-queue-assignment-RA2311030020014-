import api from "../api/axios";

export const metricsService = {
  get: () => api.get("/metrics"),
};

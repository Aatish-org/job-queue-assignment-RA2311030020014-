import api from "../api/axios";
import type { Job } from "../types";

export const jobService = {
  list: (queueId: string, status?: string) =>
    api.get<Job[]>(`/jobs?queueId=${queueId}${status ? `&status=${status}` : ""}`),
  create: (payload: Record<string, any>) => api.post<Job>("/jobs", payload),
  getById: (id: string) => api.get<Job>(`/jobs/${id}`),
  cancel: (id: string) => api.patch<Job>(`/jobs/${id}/cancel`),
};

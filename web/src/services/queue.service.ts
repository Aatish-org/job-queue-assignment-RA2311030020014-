import api from "../api/axios";
import type { Queue } from "../types";

export const queueService = {
  list: (projectId: string) => api.get<Queue[]>(`/queues?projectId=${projectId}`),
  create: (projectId: string, name: string, payload: Partial<Queue>) =>
    api.post<Queue>("/queues", { projectId, name, ...payload }),
  pause: (id: string) => api.patch<Queue>(`/queues/${id}/pause`),
  resume: (id: string) => api.patch<Queue>(`/queues/${id}/resume`),
};

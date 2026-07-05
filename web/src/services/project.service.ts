import api from "../api/axios";
import type { Project } from "../types";

export const projectService = {
  list: () => api.get<Project[]>("/projects"),
  create: (name: string) => api.post<Project>("/projects", { name }),
};

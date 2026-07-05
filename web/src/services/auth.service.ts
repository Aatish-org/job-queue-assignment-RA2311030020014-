import api from "../api/axios";
import type { AuthResponse } from "../types";

export const authService = {
  login: (email: string, password: string) => api.post<AuthResponse>("/auth/login", { email, password }),
  register: (email: string, password: string, name?: string) =>
    api.post<AuthResponse>("/auth/register", { email, password, name }),
};

import { apiClient } from "@/lib/api/client";
import type { Session } from "@/types/auth";

export type LoginInput = { email: string; password: string };

export type SignupInput = {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  referralCode?: string;
};

export type AuthResponse = {
  success?: boolean;
  message?: string;
  token?: string;
  jwt?: string;
  user?: any;
  error?: string;
};

export const authService = {
  getSession: () => apiClient.get<Session>("/auth/me"),
  login: async (input: LoginInput): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>("/auth/login", input);
    if (res?.token || res?.jwt) {
      if (typeof window !== "undefined") {
        localStorage.setItem("frenzone_token", res.token || res.jwt || "");
        localStorage.setItem("token", res.token || res.jwt || "");
        if (res.user) {
          localStorage.setItem("user", JSON.stringify(res.user));
        }
      }
    }
    return res;
  },
  signup: async (input: SignupInput): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>("/auth/signup", input);
    if (res?.token || res?.jwt) {
      if (typeof window !== "undefined") {
        localStorage.setItem("frenzone_token", res.token || res.jwt || "");
        localStorage.setItem("token", res.token || res.jwt || "");
        if (res.user) {
          localStorage.setItem("user", JSON.stringify(res.user));
        }
      }
    }
    return res;
  },
  logout: () => apiClient.post<void>("/auth/logout"),
  refreshSession: () => apiClient.post<Session>("/auth/refresh"),
};

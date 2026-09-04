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
  getSession: async (): Promise<Session> => {
    const res = await apiClient.get<{ success: boolean; user: any }>("/auth/me");
    return {
      user: {
        id: res.user._id,
        role: res.user.role || "CREATOR",
        displayName: `${res.user.firstname || ""} ${res.user.lastname || ""}`.trim() || res.user.username,
        email: res.user.email,
        creatorId: res.user.creatorApplicationId,
        agencyId: res.user.agencyMembership?.agency_id?._id,
      },
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    };
  },
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
    let res: AuthResponse;
    try {
      res = await apiClient.post<AuthResponse>("/auth/web-signup", input);
    } catch {
      res = await apiClient.post<AuthResponse>("/auth/signup", input);
    }
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

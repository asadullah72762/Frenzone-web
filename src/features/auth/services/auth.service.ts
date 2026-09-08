import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
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
  accountType?: "CREATOR" | "AGENCY";
  agencyName?: string;
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
        role: res.user.role || "USER",
        displayName: `${res.user.firstname || ""} ${res.user.lastname || ""}`.trim() || res.user.username,
        email: res.user.email,
        creatorId: res.user.creatorApplicationId,
        agencyId: res.user.agencyMembership?.agency_id?._id,
        isCreator: Boolean(res.user.isCreator),
        isAgencyMember: Boolean(res.user.isAgencyMember),
        creatorStatus: res.user.creatorStatus,
        agencyMembership: res.user.agencyMembership,
        profilePicture: res.user.profilePicture,
      },
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    };
  },

  login: async (input: LoginInput): Promise<AuthResponse> => {
    try {
      // 1. Authenticate against Firebase Authentication
      const credential = await signInWithEmailAndPassword(
        auth,
        input.email.trim().toLowerCase(),
        input.password
      );
      const token = await credential.user.getIdToken();

      if (typeof window !== "undefined") {
        localStorage.setItem("frenzone_token", token);
        localStorage.setItem("token", token);
      }

      // 2. Fetch authenticated MongoDB user profile
      const session = await authService.getSession();
      if (session.user && typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(session.user));
      }

      return {
        success: true,
        token,
        user: session.user,
      };
    } catch (err: any) {
      console.error("Firebase Login Error:", err);
      let errorMsg = "Failed to sign in. Please check your credentials.";
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        errorMsg = "Invalid email or password. Please verify your credentials.";
      } else if (err.code === "auth/too-many-requests") {
        errorMsg = "Access to this account has been temporarily disabled due to many failed login attempts. Please try again later.";
      } else if (err.code === "auth/user-disabled") {
        errorMsg = "This user account has been disabled.";
      } else if (err.message) {
        errorMsg = err.message;
      }
      return {
        success: false,
        error: errorMsg,
      };
    }
  },

  signup: async (input: SignupInput): Promise<AuthResponse> => {
    try {
      // 1. Register identity in Firebase Authentication
      const credential = await createUserWithEmailAndPassword(
        auth,
        input.email.trim().toLowerCase(),
        input.password
      );
      const token = await credential.user.getIdToken();

      if (typeof window !== "undefined") {
        localStorage.setItem("frenzone_token", token);
        localStorage.setItem("token", token);
      }

      // 2. Synchronize profile with MongoDB backend
      const res = await apiClient.post<AuthResponse>("/auth/web-signup", {
        ...input,
        idToken: token,
      });

      if (res.user && typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(res.user));
      }

      return {
        ...res,
        token,
      };
    } catch (err: any) {
      console.error("Firebase Signup Error:", err);
      let errorMsg = "Registration failed. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        errorMsg = "An account with this email address already exists. Please log in.";
      } else if (err.code === "auth/weak-password") {
        errorMsg = "Password should be at least 6 characters.";
      } else if (err.message) {
        errorMsg = err.message;
      }
      return {
        success: false,
        error: errorMsg,
      };
    }
  },

  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Firebase signOut error:", err);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("frenzone_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    await apiClient.post("/auth/logout").catch(() => {});
  },

  refreshSession: () => apiClient.post<Session>("/auth/refresh"),
};

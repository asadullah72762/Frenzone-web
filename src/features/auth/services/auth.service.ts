import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/config";
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
    const normalizedEmail = input.email.trim().toLowerCase();

    // Strategy 1: Attempt Firebase Authentication
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        input.password
      );
      const token = await credential.user.getIdToken();

      if (typeof window !== "undefined") {
        localStorage.setItem("frenzone_token", token);
        localStorage.setItem("token", token);
      }

      // Ensure MongoDB identity synchronization
      try {
        await apiClient.post("/auth/web-signup", {
          firstname: credential.user.displayName || "User",
          email: normalizedEmail,
          idToken: token,
        });
      } catch (syncErr) {
        console.warn("MongoDB sync notice on login:", syncErr);
      }

      // Fetch authoritative MongoDB user profile
      const session = await authService.getSession();
      if (session.user && typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(session.user));
      }

      return {
        success: true,
        token,
        user: session.user,
      };
    } catch (fbErr: any) {
      console.warn("Firebase authentication bypassed/failed, falling back to authoritative backend database:", fbErr.code || fbErr.message);

      // Strategy 2: Authoritative Backend Database Authentication (MongoDB bcrypt)
      try {
        const backendRes = await apiClient.post<{ user: any; token: string }>("/auth/login", {
          email: normalizedEmail,
          password: input.password,
        });

        if (backendRes?.token) {
          if (typeof window !== "undefined") {
            localStorage.setItem("frenzone_token", backendRes.token);
            localStorage.setItem("token", backendRes.token);
            if (backendRes.user) {
              localStorage.setItem("user", JSON.stringify(backendRes.user));
            }
          }

          const session = await authService.getSession();
          return {
            success: true,
            token: backendRes.token,
            user: session.user || backendRes.user,
          };
        }
      } catch (backendErr: any) {
        console.error("Backend database login error:", backendErr);
        const msg = backendErr?.message || "";
        if (msg.toLowerCase().includes("banned")) {
          return {
            success: false,
            error: "This user account has been disabled.",
          };
        }
      }

      // If both authentication strategies fail, provide clean actionable error
      let errorMsg = "Invalid email or password. Please verify your credentials.";
      if (fbErr.code === "auth/too-many-requests") {
        errorMsg = "Access to this account has been temporarily disabled due to many failed login attempts. Please try again later.";
      } else if (fbErr.code === "auth/user-disabled") {
        errorMsg = "This user account has been disabled.";
      }

      return {
        success: false,
        error: errorMsg,
      };
    }
  },

  loginWithGoogle: async (
    targetPortal?: "CREATOR" | "AGENCY",
    agencyName?: string,
    referralCode?: string
  ): Promise<AuthResponse> => {
    try {
      // 1. Trigger Firebase Google Authentication Popup
      const credential = await signInWithPopup(auth, googleProvider);
      const firebaseUser = credential.user;
      const token = await firebaseUser.getIdToken();

      if (typeof window !== "undefined") {
        localStorage.setItem("frenzone_token", token);
        localStorage.setItem("token", token);
      }

      // 2. Parse display name for backend user creation / sync
      const fullName = (firebaseUser.displayName || "").trim();
      let firstname = "";
      let lastname = "";
      if (fullName) {
        const parts = fullName.split(/\s+/);
        firstname = parts[0] || "";
        lastname = parts.slice(1).join(" ") || "";
      }
      if (!firstname) {
        firstname = (firebaseUser.email || "user").split("@")[0] || "User";
      }

      // 3. Synchronize identity with backend MongoDB
      const res = await apiClient.post<AuthResponse>("/auth/web-signup", {
        firstname,
        lastname,
        email: firebaseUser.email,
        idToken: token,
        accountType: targetPortal,
        agencyName: targetPortal === "AGENCY" ? agencyName : undefined,
        referralCode: referralCode || undefined,
      });

      // 4. Resolve authoritative backend session profile
      const session = await authService.getSession();
      if (session.user && typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(session.user));
      }

      return {
        success: true,
        token,
        user: session.user || res.user,
      };
    } catch (err: any) {
      console.error("Firebase Google Auth Error:", err);
      let errorMsg = "Google Sign-In failed. Please try again.";
      if (err.code === "auth/popup-closed-by-user") {
        errorMsg = "Sign-in popup was closed before completing authentication.";
      } else if (err.code === "auth/popup-blocked") {
        errorMsg = "Sign-in popup was blocked by your browser. Please allow popups for this site.";
      } else if (err.code === "auth/cancelled-popup-request") {
        errorMsg = "Multiple popup requests were initiated. Please try again.";
      } else if (err.code === "auth/account-exists-with-different-credential") {
        errorMsg = "An account already exists with the same email address using another login provider.";
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

  loginDemo: async (role: "CREATOR" | "AGENCY"): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post<AuthResponse>("/auth/demo-login", { role });
      if (res.token && typeof window !== "undefined") {
        localStorage.setItem("frenzone_token", res.token);
        localStorage.setItem("token", res.token);
      }
      const session = await authService.getSession();
      if (session.user && typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(session.user));
      }
      return {
        success: true,
        token: res.token,
        user: session.user || res.user,
      };
    } catch (err: any) {
      console.error("Demo login error:", err);
      return {
        success: false,
        error: err.message || "Failed to initialize demo session.",
      };
    }
  },

  refreshSession: () => apiClient.post<Session>("/auth/refresh"),
};

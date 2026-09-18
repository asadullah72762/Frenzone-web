import { ApiError } from "./types";
import { auth } from "@/lib/firebase/config";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

/**
 * Resolves a valid authentication token.
 * Dynamically queries Firebase Auth SDK to ensure tokens are kept fresh.
 */
async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const storedToken =
    localStorage.getItem("token") ||
    localStorage.getItem("frenzone_token");

  if (storedToken) {
    return storedToken;
  }

  try {
    if (typeof auth.authStateReady === "function") {
      await auth.authStateReady();
    }
    if (auth.currentUser) {
      const freshToken = await auth.currentUser.getIdToken();
      if (freshToken) {
        return freshToken;
      }
    }
  } catch (err) {
    console.warn("Could not retrieve fresh Firebase token:", err);
  }

  return null;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers as Record<string, string>),
  };

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers,
    });
  } catch (netErr: any) {
    throw new ApiError(
      netErr?.message || "Network error: Unable to connect to server.",
      0,
      { code: "NETWORK_ERROR" }
    );
  }

  // Auto-recovery for 401 Unauthorized (expired token)
  const isRetry = (init?.headers as Record<string, string>)?.[ "X-Retry" ] === "true";
  if (response.status === 401 && !isRetry && typeof window !== "undefined") {
    try {
      if (auth.currentUser) {
        const freshToken = await auth.currentUser.getIdToken(true);
        if (freshToken) {
          localStorage.setItem("frenzone_token", freshToken);
          return await request<T>(path, {
            ...init,
            headers: {
              ...(init?.headers as Record<string, string>),
              Authorization: `Bearer ${freshToken}`,
              "X-Retry": "true",
            },
          });
        }
      }
    } catch {
      // Refresh failed, proceed to standard error throw below
    }
  }

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg =
      responseData.error ||
      responseData.message ||
      `Request failed with status ${response.status}`;

    throw new ApiError(errorMsg, response.status, {
      code: responseData.code,
      fieldErrors: responseData.fieldErrors,
      data: responseData,
    });
  }

  return responseData as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  delete: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "DELETE",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  postFormData: async <T>(path: string, formData: FormData): Promise<T> => {
    const token = await getAuthToken();

    let response: Response;
    try {
      response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
    } catch (netErr: any) {
      throw new ApiError(netErr?.message || "Upload network error.", 0, { code: "NETWORK_ERROR" });
    }

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = responseData.error || responseData.message || "Upload failed. Please try again.";
      throw new ApiError(errorMsg, response.status, {
        code: responseData.code,
        data: responseData,
      });
    }

    return responseData as T;
  },
};

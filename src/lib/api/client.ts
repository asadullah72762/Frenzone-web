import type { ApiError } from "./types";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("frenzone_token") || localStorage.getItem("token")
      : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers as Record<string, string>),
  };

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw {
      status: response.status,
      message: responseData.error || responseData.message || "Something went wrong. Please try again.",
    } satisfies ApiError;
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
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  delete: <T>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),
  postFormData: async <T>(path: string, formData: FormData): Promise<T> => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("frenzone_token") || localStorage.getItem("token")
        : null;

    const response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw {
        status: response.status,
        message: responseData.error || responseData.message || "Upload failed. Please try again.",
      } satisfies ApiError;
    }

    return responseData as T;
  },
};

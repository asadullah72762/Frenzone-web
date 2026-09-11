/**
 * Canonical Referral URL Generator
 * 
 * Guarantees environment awareness across both client and server runtime:
 * - Local Development: http://localhost:3000/signup?ref={CODE}
 * - Production: https://frenzone.live/signup?ref={CODE}
 * 
 * Guarantees:
 * - Localhost is NEVER exposed or hardcoded in production builds/environments.
 * - Copy Link, QR Code Canvas, Download QR Image, and Native Share all consume
 *   this exact same canonical URL.
 */

export function extractReferralCode(input?: string): string {
  if (!input) return "";
  const trimmed = input.trim();

  // If it's already a clean code (no slashes, no query)
  if (!trimmed.includes("/") && !trimmed.includes("?")) {
    return trimmed;
  }

  try {
    // Parse query param ?ref= or ?referralCode=
    if (trimmed.includes("?")) {
      const queryPart = trimmed.split("?")[1];
      const params = new URLSearchParams(queryPart);
      const code = params.get("ref") || params.get("referralCode");
      if (code) return code.trim();
    }

    // Parse path e.g. /join/CODE
    const pathname = trimmed.startsWith("http") ? new URL(trimmed).pathname : trimmed;
    const segments = pathname.split("/").filter(Boolean);
    const joinIdx = segments.indexOf("join");
    if (joinIdx !== -1 && segments[joinIdx + 1]) {
      return segments[joinIdx + 1].trim();
    }
  } catch {}

  return trimmed;
}

export function getCanonicalFrontendBaseUrl(): string {
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_ENVIRONMENT === "production";

  // Browser environment
  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    const isLocalOrigin =
      origin.includes("localhost") ||
      origin.includes("127.0.0.1") ||
      origin.includes("[::1]");

    if (isProduction) {
      // Security: In production, NEVER expose localhost even if accessed via tunnel/proxy
      return isLocalOrigin ? "https://frenzone.live" : origin;
    }

    // Development: Use current browser origin (e.g. http://localhost:3000)
    return isLocalOrigin ? origin : "http://localhost:3000";
  }

  // Server-Side Rendering (SSR) / Static Generation
  if (isProduction) {
    const configured = (process.env.NEXT_PUBLIC_APP_URL || "").trim().replace(/\/+$/, "");
    if (configured && !configured.includes("localhost") && !configured.includes("127.0.0.1")) {
      return configured;
    }
    return "https://frenzone.live";
  }

  // Development SSR:
  const devUrl = (process.env.NEXT_PUBLIC_APP_URL || "").trim().replace(/\/+$/, "");
  return devUrl || "http://localhost:3000";
}

export function getCanonicalReferralUrl(referralCode?: string, fallbackUrl?: string): string {
  const code = (referralCode || extractReferralCode(fallbackUrl) || "").trim();
  if (!code) return "";

  const baseUrl = getCanonicalFrontendBaseUrl();
  return `${baseUrl}/signup?ref=${encodeURIComponent(code)}`;
}

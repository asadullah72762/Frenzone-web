const isProduction =
  process.env.NODE_ENV === "production" ||
  process.env.NEXT_PUBLIC_ENVIRONMENT === "production";

const defaultUrl = isProduction ? "https://frenzone.live" : "http://localhost:3000";
const configuredUrl = (process.env.NEXT_PUBLIC_APP_URL || "").trim();

export const siteConfig = {
  name: "Frenzone",
  description: "Frenzone Creator and Agency platform.",
  url: isProduction
    ? (configuredUrl && !configuredUrl.includes("localhost") ? configuredUrl : "https://frenzone.live")
    : (configuredUrl || defaultUrl),
} as const;

export type AnalyticsEvent = { name: string; properties?: Record<string, string | number | boolean> };
export function trackEvent(_event: AnalyticsEvent) { /* Provider intentionally connected later. Never send private or payment data. */ }

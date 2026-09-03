import type { Money } from "@/types/common";
export const formatCurrency = (value: Money) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: value.currency,
  }).format(Number(value.amount));
export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);
export const formatPercentage = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 }).format(
    value,
  );
export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));

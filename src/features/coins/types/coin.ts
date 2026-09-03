import type { Money } from "@/types/common";

export type CoinPackage = {
  id: string;
  coinAmount: number;
  originalPrice: Money;
  finalPrice: Money;
  discountLabel?: string;
};

export type CoinOrder = {
  id: string;
  status: "PENDING" | "AWAITING_PAYMENT" | "PAID" | "FAILED" | "CANCELLED";
};

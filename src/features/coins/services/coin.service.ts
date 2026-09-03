import { apiClient } from "@/lib/api/client";
import type { CoinPackage } from "../types/coin";

export type PackagesResponse = {
  success: boolean;
  store: string;
  discountTier: string;
  packages: CoinPackage[];
};

export type CheckoutResponse = {
  success: boolean;
  order: {
    order_id: string;
    user_id: string;
    package_id: string;
    coins: number;
    amount_usd: number;
    currency: string;
    store_type: string;
  };
};

export const coinService = {
  async getPackages(storeType?: "public" | "agency"): Promise<CoinPackage[]> {
    const query = storeType === "agency" ? "?store=agency" : "";
    const response = await apiClient.get<PackagesResponse>(`/coins/packages${query}`);
    return response.packages || [];
  },

  async createOrder(packageId: string, storeType: string = "WEB_PUBLIC"): Promise<CheckoutResponse> {
    return apiClient.post<CheckoutResponse>("/coins/checkout", {
      package_id: packageId,
      store_type: storeType,
    });
  },

  async verifyPurchase(orderId: string, packageId: string, storeType: string = "WEB_PUBLIC") {
    return apiClient.post<{ success: boolean; message: string; coinsCredited: number }>(
      "/coins/verify-purchase",
      {
        order_id: orderId,
        package_id: packageId,
        store_type: storeType,
      }
    );
  },
};

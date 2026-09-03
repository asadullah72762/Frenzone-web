export interface CoinPackage {
  id: string;
  name: string;
  coinAmount: number;
  bonusCoins?: number;
  originalPrice: { amount: string; currency: string };
  finalPrice: { amount: string; currency: string };
  discountLabel: string;
  isPopular?: boolean;
  isBestValue?: boolean;
}

export const coinPackagesMock: CoinPackage[] = [
  {
    id: "coins-100",
    name: "Starter Pack",
    coinAmount: 100,
    bonusCoins: 0,
    originalPrice: { amount: "1.99", currency: "USD" },
    finalPrice: { amount: "1.79", currency: "USD" },
    discountLabel: "10% Website Discount",
  },
  {
    id: "coins-500",
    name: "Popular Pack",
    coinAmount: 500,
    bonusCoins: 50,
    originalPrice: { amount: "8.99", currency: "USD" },
    finalPrice: { amount: "8.09", currency: "USD" },
    discountLabel: "10% Website Discount",
    isPopular: true,
  },
  {
    id: "coins-1000",
    name: "Creator Fan Pack",
    coinAmount: 1000,
    bonusCoins: 120,
    originalPrice: { amount: "16.99", currency: "USD" },
    finalPrice: { amount: "15.29", currency: "USD" },
    discountLabel: "10% Website Discount",
  },
  {
    id: "coins-2500",
    name: "Pro Supporter Pack",
    coinAmount: 2500,
    bonusCoins: 350,
    originalPrice: { amount: "39.99", currency: "USD" },
    finalPrice: { amount: "35.99", currency: "USD" },
    discountLabel: "10% Website Discount",
    isBestValue: true,
  },
  {
    id: "coins-5000",
    name: "VIP VIP Pack",
    coinAmount: 5000,
    bonusCoins: 800,
    originalPrice: { amount: "79.99", currency: "USD" },
    finalPrice: { amount: "71.99", currency: "USD" },
    discountLabel: "10% Website Discount",
  },
  {
    id: "coins-10000",
    name: "Legendary Whale Pack",
    coinAmount: 10000,
    bonusCoins: 2000,
    originalPrice: { amount: "149.99", currency: "USD" },
    finalPrice: { amount: "134.99", currency: "USD" },
    discountLabel: "10% Website Discount",
  },
];

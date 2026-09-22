export interface CoinPackage {
  id: string;
  name: string;
  coinAmount: number;
  originalPrice: { amount: string; currency: string };
  finalPrice: { amount: string; currency: string };
  discountLabel: string;
  isPopular?: boolean;
  isBestValue?: boolean;
}

// 1,000 Coins = $12.00 USD ($0.012 / coin final with 10% web discount)
export const coinPackagesMock: CoinPackage[] = [
  {
    id: "coins-100",
    name: "100 Coins",
    coinAmount: 100,
    originalPrice: { amount: "1.33", currency: "USD" },
    finalPrice: { amount: "1.20", currency: "USD" },
    discountLabel: "10% OFF",
  },
  {
    id: "coins-500",
    name: "500 Coins",
    coinAmount: 500,
    originalPrice: { amount: "6.67", currency: "USD" },
    finalPrice: { amount: "6.00", currency: "USD" },
    discountLabel: "10% OFF",
    isPopular: true,
  },
  {
    id: "coins-1000",
    name: "1,000 Coins",
    coinAmount: 1000,
    originalPrice: { amount: "13.33", currency: "USD" },
    finalPrice: { amount: "12.00", currency: "USD" },
    discountLabel: "10% OFF",
    isBestValue: true,
  },
  {
    id: "coins-2500",
    name: "2,500 Coins",
    coinAmount: 2500,
    originalPrice: { amount: "33.33", currency: "USD" },
    finalPrice: { amount: "30.00", currency: "USD" },
    discountLabel: "10% OFF",
  },
  {
    id: "coins-5000",
    name: "5,000 Coins",
    coinAmount: 5000,
    originalPrice: { amount: "66.67", currency: "USD" },
    finalPrice: { amount: "60.00", currency: "USD" },
    discountLabel: "10% OFF",
  },
  {
    id: "coins-10000",
    name: "10,000 Coins",
    coinAmount: 10000,
    originalPrice: { amount: "133.33", currency: "USD" },
    finalPrice: { amount: "120.00", currency: "USD" },
    discountLabel: "10% OFF",
  },
];

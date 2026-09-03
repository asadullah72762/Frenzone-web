import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { CoinStore } from "@/features/coins/components/coin-store";
import { coinPackagesMock } from "@/mocks/coin-packages.mock";
export const metadata: Metadata = {
  title: "Coins",
  description: "Purchase Frenzone Coins.",
};
export default function CoinsPage() {
  return (
    <Container className="py-16">
      <p className="text-brand text-sm font-bold tracking-wider uppercase">
        Coin Store
      </p>
      <h1 className="mt-3 text-4xl font-bold">Choose your Coin package</h1>
      <p className="text-text-secondary mt-3">
        Pricing and payment availability are confirmed securely by Frenzone at checkout.
      </p>
      <div className="mt-8"><CoinStore packages={coinPackagesMock} /></div>
    </Container>
  );
}

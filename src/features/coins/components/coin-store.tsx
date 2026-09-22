"use client";

import { useState } from "react";
import { CheckCircle2, CreditCard, ShieldCheck, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatting";
import type { CoinPackage } from "@/mocks/coin-packages.mock";

// Real 3D coin and diamond image assets based on package tier
function getPackageAsset(coinAmount: number) {
  if (coinAmount >= 5000) {
    return {
      src: "/assets/coin-diamond.jpg",
      alt: "VIP Diamond Coins",
      tierLabel: "Diamond VIP Tier",
      badgeClass: "bg-brand-soft text-brand-active border-brand/20",
    };
  }
  if (coinAmount >= 1000) {
    return {
      src: "/assets/coin-stack.jpg",
      alt: "Gold Coins Stack",
      tierLabel: "Popular Tier",
      badgeClass: "bg-brand-soft text-brand-active border-brand/20",
    };
  }
  return {
    src: "/assets/coin-single.jpg",
    alt: "Single Gold Coin",
    tierLabel: "Starter Tier",
    badgeClass: "bg-surface-muted text-text-secondary border-border",
  };
}

export function CoinStore({ packages }: { packages: CoinPackage[] }) {
  const [selectedId, setSelectedId] = useState(packages[2]?.id || packages[0]?.id); // Default to 1,000 Coins ($12.00)
  const [state, setState] = useState<"select" | "review" | "success">("select");
  const [paymentMethod, setPaymentMethod] = useState<"PAYPAL" | "CARD">("PAYPAL");

  const selected = packages.find((item) => item.id === selectedId) || packages[0];

  // In-app discount savings calculation
  const origNum = parseFloat(selected.originalPrice.amount);
  const finalNum = parseFloat(selected.finalPrice.amount);
  const savings = (origNum - finalNum).toFixed(2);

  if (state === "success") {
    return (
      <Card className="mx-auto max-w-lg text-center p-8 space-y-4 animate-in zoom-in-95 duration-200 border-border shadow-elevated bg-surface">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success shadow-xs">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary">Payment Successful</h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Your order for <strong className="text-brand font-bold">{selected.coinAmount.toLocaleString()} Coins</strong> has been confirmed.
        </p>
        <div className="rounded-xl bg-surface-muted p-4 text-xs text-text-secondary border border-border text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-text-muted">Package:</span>
            <span className="font-semibold text-text-primary">{selected.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Amount Credited:</span>
            <span className="font-semibold text-text-primary">{selected.coinAmount.toLocaleString()} Coins</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Total Charged:</span>
            <span className="font-bold text-brand">{formatCurrency(selected.finalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Payment Channel:</span>
            <span className="font-medium text-text-primary">{paymentMethod === "PAYPAL" ? "PayPal" : "Credit Card"}</span>
          </div>
          <p className="pt-2 text-[11px] text-text-muted border-t border-border">
            Coins are linked and available immediately in your Frenzone app account.
          </p>
        </div>
        <Button
          variant="primary"
          className="w-full bg-brand hover:bg-brand-hover text-white font-bold h-11 rounded-xl shadow-sm"
          onClick={() => setState("select")}
        >
          Purchase Another Package
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      {/* Premium Package Plans Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {packages.map((pkg) => {
          const isSelected = selectedId === pkg.id;
          const asset = getPackageAsset(pkg.coinAmount);

          return (
            <div
              key={pkg.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedId(pkg.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedId(pkg.id);
                }
              }}
              className={`relative rounded-2xl border p-5 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-brand bg-brand-soft/20 ring-2 ring-brand/40 shadow-md"
                  : "border-border bg-surface hover:border-brand/40 hover:shadow-xs"
              }`}
            >
              <div className="space-y-4">
                {/* Top Row: Package Name & High-Contrast Status Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs uppercase tracking-wider ${
                      isSelected ? "font-bold text-brand" : "font-semibold text-text-secondary"
                    }`}
                  >
                    {pkg.name}
                  </span>

                  {pkg.isBestValue ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand text-white border border-brand-active shadow-xs">
                      Best Value
                    </span>
                  ) : pkg.isPopular ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand text-white border border-brand-active shadow-xs">
                      Most Popular
                    </span>
                  ) : (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isSelected
                          ? "bg-brand text-white border-brand-active shadow-xs"
                          : "bg-brand-soft text-brand-active border-brand/20"
                      }`}
                    >
                      {isSelected ? "Selected" : asset.tierLabel}
                    </span>
                  )}
                </div>

                {/* Real 3D Coin Image & Refined Amount Display */}
                <div className="flex items-center space-x-3.5 py-1">
                  <div
                    className={`relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl overflow-hidden border shrink-0 shadow-xs transition-colors ${
                      isSelected ? "border-brand/40 bg-brand-soft/30" : "border-border bg-surface-muted"
                    }`}
                  >
                    <img
                      src={asset.src}
                      alt={asset.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <div className="flex items-baseline space-x-1.5">
                      <span
                        className={`text-2xl sm:text-3xl font-semibold tracking-normal tabular-nums ${
                          isSelected ? "text-brand" : "text-text-primary"
                        }`}
                      >
                        {pkg.coinAmount.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-brand uppercase tracking-wide">
                        Coins
                      </span>
                    </div>
                    <p className="text-xs text-text-muted font-normal mt-0.5">
                      {pkg.coinAmount >= 5000 ? "Diamond VIP Allocation" : "Verified App Balance"}
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2 text-xs text-text-secondary border-t border-border pt-3.5">
                  <li className="flex items-center space-x-2">
                    <Check className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-brand" : "text-success"}`} />
                    <span>Direct Frenzone account credit</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-brand" : "text-success"}`} />
                    <span>10% Web store discount included</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-brand" : "text-success"}`} />
                    <span>Instant digital delivery</span>
                  </li>
                </ul>
              </div>

              {/* Price & Selection Footer */}
              <div className="mt-5 pt-4 border-t border-border space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline space-x-2">
                    <span
                      className={`text-xl font-bold tabular-nums ${
                        isSelected ? "text-brand" : "text-text-primary"
                      }`}
                    >
                      {formatCurrency(pkg.finalPrice)}
                    </span>
                    <span className="text-xs text-text-muted line-through font-normal tabular-nums">
                      {formatCurrency(pkg.originalPrice)}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-brand bg-brand-soft px-2 py-0.5 rounded-full border border-brand/20">
                    {pkg.discountLabel}
                  </span>
                </div>

                {/* Selection Button (Consistent Orange Brand Theme) */}
                <div
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                    isSelected
                      ? "bg-brand hover:bg-brand-hover text-white shadow-md shadow-brand/20 border border-brand-active"
                      : "bg-brand-soft/40 hover:bg-brand hover:text-white text-brand border border-brand/30"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-4 w-4 text-white" />
                      <span className="text-white">Selected Plan</span>
                    </>
                  ) : (
                    <>
                      <span>Select Plan</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar Order Summary */}
      <Card className="h-fit space-y-5 border-border shadow-sm bg-surface">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-text-primary">Order Summary</CardTitle>
          <CardDescription className="text-xs text-text-secondary">
            Verified coin purchase for Frenzone account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          <div className="rounded-xl border border-border bg-surface-muted/60 p-4 space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-text-primary">{selected.name}</span>
              <span className="font-bold text-brand tabular-nums">{selected.coinAmount.toLocaleString()} Coins</span>
            </div>

            <div className="flex justify-between text-xs text-text-muted pt-1">
              <span>Standard Reference:</span>
              <span className="line-through tabular-nums">{formatCurrency(selected.originalPrice)}</span>
            </div>

            <div className="flex justify-between text-xs text-success font-semibold">
              <span>Web Discount (10%):</span>
              <span className="tabular-nums">-${savings} USD</span>
            </div>

            <div className="border-t border-border pt-2.5 flex justify-between items-baseline">
              <span className="text-sm font-bold text-text-primary">Total to Pay:</span>
              <span className="text-2xl font-bold text-brand tabular-nums">
                {formatCurrency(selected.finalPrice)}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("PAYPAL")}
                className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === "PAYPAL"
                    ? "border-brand bg-brand-soft text-brand-active shadow-xs"
                    : "border-border bg-surface text-text-secondary hover:bg-surface-muted"
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>PayPal</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("CARD")}
                className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === "CARD"
                    ? "border-brand bg-brand-soft text-brand-active shadow-xs"
                    : "border-border bg-surface text-text-secondary hover:bg-surface-muted"
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>Credit Card</span>
              </button>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full bg-brand hover:bg-brand-hover text-white font-bold h-11 text-sm rounded-xl shadow-md transition-all active:scale-[0.99]"
            size="lg"
            onClick={() => setState("review")}
          >
            Pay {formatCurrency(selected.finalPrice)}
          </Button>

          {state === "review" && (
            <div className="space-y-2 pt-2 border-t border-border animate-in fade-in">
              <p className="text-xs text-text-muted text-center">Confirm purchase of {selected.coinAmount.toLocaleString()} Coins:</p>
              <Button
                variant="primary"
                className="w-full bg-brand hover:bg-brand-hover text-white font-bold text-xs h-9 shadow-sm"
                onClick={() => setState("success")}
              >
                Confirm & Complete Payment
              </Button>
            </div>
          )}

          <div className="flex items-center space-x-2 text-[11px] text-text-muted pt-2 border-t border-border">
            <ShieldCheck className="h-4 w-4 text-success shrink-0" />
            <span>256-bit SSL encrypted checkout. Verified by Frenzone.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

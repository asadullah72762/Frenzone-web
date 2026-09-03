"use client";

import { useState } from "react";
import { CheckCircle2, CreditCard, ShieldCheck, Flame, ShoppingBag, ArrowRight, Coins, Gem, Crown, Zap, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatting";
import type { CoinPackage } from "@/mocks/coin-packages.mock";

// Helper to return tier icons and accent styles
function getTierVisual(coinAmount: number) {
  if (coinAmount >= 10000) {
    return {
      icon: Crown,
      bg: "bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-400 text-white shadow-lg ring-4 ring-amber-400/20",
      accent: "from-amber-500/15 via-orange-500/5 to-transparent",
      border: "border-amber-500/40",
      glow: "shadow-amber-500/20",
      tierLabel: "Legendary Tier",
    };
  }
  if (coinAmount >= 5000) {
    return {
      icon: Gem,
      bg: "bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 text-white shadow-lg ring-4 ring-pink-400/20",
      accent: "from-purple-500/15 via-fuchsia-500/5 to-transparent",
      border: "border-purple-500/40",
      glow: "shadow-purple-500/20",
      tierLabel: "VIP Diamond Tier",
    };
  }
  if (coinAmount >= 2500) {
    return {
      icon: Zap,
      bg: "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-500 text-white shadow-lg ring-4 ring-emerald-400/20",
      accent: "from-emerald-500/15 via-teal-500/5 to-transparent",
      border: "border-emerald-500/40",
      glow: "shadow-emerald-500/20",
      tierLabel: "Pro Supporter Tier",
    };
  }
  if (coinAmount >= 500) {
    return {
      icon: Flame,
      bg: "bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white shadow-lg ring-4 ring-violet-400/20",
      accent: "from-violet-500/15 via-indigo-500/5 to-transparent",
      border: "border-brand/40",
      glow: "shadow-violet-500/20",
      tierLabel: "Popular Streamer Tier",
    };
  }
  return {
    icon: Coins,
    bg: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white shadow-sm ring-2 ring-slate-400/10",
    accent: "from-slate-500/10 to-transparent",
    border: "border-border",
    glow: "shadow-slate-500/10",
    tierLabel: "Starter Tier",
  };
}

export function CoinStore({ packages }: { packages: CoinPackage[] }) {
  const [selectedId, setSelectedId] = useState(packages[1]?.id || packages[0]?.id);
  const [state, setState] = useState<"select" | "review" | "success" | "failure">("select");
  const [paymentMethod, setPaymentMethod] = useState<"PAYPAL" | "CARD">("PAYPAL");

  const selected = packages.find((item) => item.id === selectedId) || packages[0];

  if (state === "success") {
    return (
      <Card className="mx-auto max-w-lg text-center p-8 space-y-4 animate-in zoom-in-95 duration-200 border-brand/30 shadow-elevated">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success shadow-sm">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-black text-text-primary">Demo Checkout Complete!</h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Order for <strong className="text-brand font-extrabold">{(selected.coinAmount + (selected.bonusCoins || 0)).toLocaleString()} Coins</strong> was processed in static mode.
        </p>
        <div className="rounded-xl bg-surface-muted p-4 text-xs text-text-secondary border border-border text-left space-y-1.5 shadow-sm">
          <p className="flex justify-between">
            <span className="text-text-muted">Package:</span>
            <span className="font-bold text-text-primary">{selected.name}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-text-muted">Total Paid:</span>
            <span className="font-extrabold text-brand">{formatCurrency(selected.finalPrice)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-text-muted">Payment Method:</span>
            <span className="font-semibold text-text-primary">{paymentMethod}</span>
          </p>
          <p className="pt-2 text-[11px] text-text-muted border-t border-border">
            Authoritative crediting is bound to production API webhooks.
          </p>
        </div>
        <Button variant="primary" className="w-full" onClick={() => setState("select")}>
          Return to Coin Store
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      {/* Tall Premium Packages Grid */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {packages.map((pkg) => {
          const isSelected = selectedId === pkg.id;
          const tier = getTierVisual(pkg.coinAmount);
          const Icon = tier.icon;

          return (
            <button
              key={pkg.id}
              onClick={() => {
                setSelectedId(pkg.id);
                setState("select");
              }}
              className={`group relative min-h-[23rem] rounded-3xl border p-7 text-left transition-all duration-300 cursor-pointer outline-none flex flex-col justify-between overflow-hidden shadow-card ${
                isSelected
                  ? "border-brand bg-gradient-to-b from-surface via-surface to-brand-soft/50 ring-4 ring-brand/40 shadow-elevated -translate-y-1.5"
                  : "border-border bg-surface hover:border-brand/40 hover:shadow-elevated hover:-translate-y-1"
              }`}
            >
              {/* Ambient Radiant Glow Background Accent */}
              <div className={`absolute -top-10 -right-10 w-44 h-44 rounded-full bg-gradient-to-br ${tier.accent} blur-2xl opacity-60 pointer-events-none`} />

              {/* Top Badges / Ribbons */}
              {pkg.isPopular && (
                <span className="absolute top-4 right-4 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-500 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                  🔥 Most Popular
                </span>
              )}
              {pkg.isBestValue && (
                <span className="absolute top-4 right-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                  💎 Best Value
                </span>
              )}

              <div className="space-y-6 relative z-10">
                {/* Header Row: Tier Icon Graphic + Name */}
                <div className="flex items-center space-x-4">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${tier.bg} ${tier.glow}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand">
                      {tier.tierLabel}
                    </span>
                    <h3 className="text-lg font-black text-text-primary leading-tight">{pkg.name}</h3>
                  </div>
                </div>

                {/* Main Coin Counter Display */}
                <div className="space-y-3 bg-surface-muted/60 rounded-2xl p-4 border border-border/60">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-black tracking-tight text-text-primary">
                      {pkg.coinAmount.toLocaleString()}
                    </span>
                    <span className="text-lg font-black bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
                      Coins
                    </span>
                  </div>

                  {pkg.bonusCoins ? (
                    <div className="inline-flex items-center space-x-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-black text-amber-700">
                      <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
                      <span>+{pkg.bonusCoins.toLocaleString()} Extra Bonus Included</span>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-text-muted block">Standard Base Tier</span>
                  )}
                </div>

                {/* Feature Bullet Points */}
                <ul className="space-y-2 text-xs font-medium text-text-secondary">
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success shrink-0" />
                    <span>Instant account digital coin credit</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success shrink-0" />
                    <span>10% Public website discount applied</span>
                  </li>
                </ul>
              </div>

              {/* Price & Selection CTA Button Footer */}
              <div className="mt-6 pt-5 border-t border-border space-y-4 relative z-10">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-text-muted line-through block font-semibold">
                      {formatCurrency(pkg.originalPrice)}
                    </span>
                    <span className="text-2xl font-black text-text-primary">
                      {formatCurrency(pkg.finalPrice)}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-success bg-success-soft px-2.5 py-1 rounded-md">
                    {pkg.discountLabel}
                  </span>
                </div>

                {/* Interactive Selection Bar */}
                <div
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 text-white shadow-md"
                      : "bg-surface-muted text-text-primary hover:bg-brand-soft hover:text-brand border border-border"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Selected Package</span>
                    </>
                  ) : (
                    <>
                      <span>Select Package</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sidebar Order Summary */}
      <Card className="h-fit space-y-5 border-brand/20 shadow-card">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-brand" />
            <CardTitle>Order Summary</CardTitle>
          </div>
          <CardDescription>Review selected Coin package and discount breakdown.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          <div className="rounded-2xl border border-brand/20 bg-gradient-to-b from-surface to-brand-soft/30 p-4 space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-text-primary">{selected.name}</span>
              <span className="font-extrabold text-brand">{selected.coinAmount.toLocaleString()} Coins</span>
            </div>

            {selected.bonusCoins ? (
              <div className="flex justify-between text-xs text-amber-600 font-bold bg-amber-500/10 px-2 py-1 rounded-md">
                <span>Bonus Coins Included</span>
                <span>+{selected.bonusCoins.toLocaleString()}</span>
              </div>
            ) : null}

            <div className="flex justify-between text-xs text-text-muted pt-1">
              <span>Original Price</span>
              <span className="line-through">{formatCurrency(selected.originalPrice)}</span>
            </div>

            <div className="flex justify-between text-xs text-success font-bold">
              <span>Website 10% Discount</span>
              <span>Applied</span>
            </div>

            <div className="border-t border-border pt-2 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-text-primary">Total Pay Amount</span>
              <span className="text-2xl font-black bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
                {formatCurrency(selected.finalPrice)}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-extrabold text-text-secondary uppercase tracking-wider">Select Payment Option</label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              <button
                type="button"
                onClick={() => setPaymentMethod("PAYPAL")}
                className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === "PAYPAL"
                    ? "border-brand bg-brand-soft text-brand shadow-sm"
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
                    ? "border-brand bg-brand-soft text-brand shadow-sm"
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
            className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-extrabold h-12 text-base rounded-xl shadow-md"
            size="lg"
            onClick={() => setState("review")}
            icon={<ArrowRight className="h-5 w-5" />}
          >
            Checkout ({formatCurrency(selected.finalPrice)})
          </Button>

          {state === "review" && (
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-xs text-text-muted text-center font-medium">Demo Mode Action Simulation:</p>
              <Button variant="secondary" className="w-full font-bold" onClick={() => setState("success")}>
                Simulate Successful Payment
              </Button>
            </div>
          )}

          <div className="flex items-center space-x-2 text-[11px] text-text-muted pt-2 border-t border-border">
            <ShieldCheck className="h-4 w-4 text-success shrink-0" />
            <span>Encrypted SSL payment pipeline. Verified by Frenzone backend.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

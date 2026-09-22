"use client";

import { useMemo, useState } from "react";
import { Coins } from "lucide-react";
import { Container } from "@/components/layout/container";

const MIN_COINS = 1000;
const MAX_COINS = 2000000;
const PERSONAL_DAILY_CAP = 2000000;
const AGENCY_DAILY_CAP = 20000000;
const PERSONAL_DISCOUNT = 0.1;
const AGENCY_DISCOUNT = 0.2;
// Illustrative reference rate; final pricing is confirmed securely at checkout.
const COIN_TO_USD = 0.01;

export default function CoinsPage() {
  const [tab, setTab] = useState<"PERSONAL" | "AGENCY">("PERSONAL");
  const [coinAmount, setCoinAmount] = useState(100000);
  const [state, setState] = useState<"select" | "success">("select");

  const isAgency = tab === "AGENCY";
  const discount = isAgency ? AGENCY_DISCOUNT : PERSONAL_DISCOUNT;
  const dailyCap = isAgency ? AGENCY_DAILY_CAP : PERSONAL_DAILY_CAP;

  const { reference, total } = useMemo(() => {
    const base = coinAmount * COIN_TO_USD;
    const discounted = base * (1 - discount);
    return { reference: base, total: discounted };
  }, [coinAmount, discount]);

  if (state === "success") {
    return (
      <Container className="py-24 text-center max-w-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success">
          <Coins className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-text-primary">Request recorded.</h1>
        <p className="mt-3 text-text-secondary">
          Your request for {coinAmount.toLocaleString()} coins (${total.toFixed(2)}) has been stored. Frenzone confirms pricing and
          availability securely at checkout.
        </p>
        <button
          type="button"
          onClick={() => setState("select")}
          className="mt-8 inline-flex items-center rounded-full bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand-hover transition-colors"
        >
          Back to coin store
        </button>
      </Container>
    );
  }

  return (
    <Container className="py-16 md:py-20">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-text-muted">Coin purchase portal</p>
        <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary">Choose coins with one simple slider.</h1>
        <p className="mt-5 text-text-secondary leading-relaxed">
          Every Frenzone app user can sign in with the same app credentials and buy coins for the same account. Personal purchases get
          10% off up to 2M daily; approved Agency inventory purchases get 20% off up to 20M daily.
        </p>
      </div>

      <div className="mt-12 max-w-3xl mx-auto rounded-3xl border border-border bg-surface p-2 sm:p-3">
        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTab("PERSONAL")}
            className={`rounded-2xl py-4 text-sm sm:text-base font-bold transition-colors ${
              tab === "PERSONAL" ? "bg-surface text-text-primary shadow-sm border border-border" : "text-text-muted hover:text-text-primary"
            }`}
          >
            Personal app account
          </button>
          <button
            type="button"
            onClick={() => setTab("AGENCY")}
            className={`rounded-2xl py-4 text-sm sm:text-base font-bold transition-colors ${
              tab === "AGENCY" ? "bg-surface text-text-primary shadow-sm border border-border" : "text-text-muted hover:text-text-primary"
            }`}
          >
            Agency inventory
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Coin amount</span>
            <span className="flex items-center gap-2 text-4xl font-black text-text-primary">
              {coinAmount.toLocaleString()}
              <Coins className="h-6 w-6 text-brand" />
            </span>
          </div>

          <input
            type="range"
            min={MIN_COINS}
            max={Math.min(MAX_COINS, dailyCap)}
            step={1000}
            value={Math.min(coinAmount, dailyCap)}
            onChange={(e) => setCoinAmount(Number(e.target.value))}
            className="w-full accent-brand cursor-pointer"
          />
          <div className="flex justify-between text-sm text-text-muted">
            <span>{MIN_COINS.toLocaleString()}</span>
            <span>{Math.min(MAX_COINS, dailyCap).toLocaleString()}</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-surface-muted p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">In-app reference</p>
              <p className="mt-1 text-xl font-bold text-text-primary">${reference.toFixed(2)}</p>
            </div>
            <div className="rounded-2xl bg-surface-muted p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Portal discount</p>
              <p className="mt-1 text-xl font-bold text-success">{Math.round(discount * 100)}% off</p>
            </div>
            <div className="rounded-2xl bg-surface-muted p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Estimated total</p>
              <p className="mt-1 text-xl font-bold text-brand">${total.toFixed(2)}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setState("success")}
            className="w-full rounded-full bg-brand py-4 text-base font-bold text-white shadow-sm hover:bg-brand-hover transition-colors"
          >
            Continue with {coinAmount.toLocaleString()} coins
          </button>
        </div>
      </div>
    </Container>
  );
}

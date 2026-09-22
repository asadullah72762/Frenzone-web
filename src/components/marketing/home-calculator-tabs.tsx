"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Building2, Calculator, ArrowRight, Radio } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatting";
import { authService } from "@/features/auth/services/auth.service";

export function HomeCalculatorTabs() {
  const [tab, setTab] = useState<"CREATOR" | "AGENCY">("CREATOR");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    authService
      .getSession()
      .then((s) => setSession(s))
      .catch(() => setSession(null));
  }, []);

  const user = session?.user;
  const isCreatorVerified = Boolean(user?.isCreatorVerified || user?.isCreator || user?.creatorStatus === "approved");
  const isAgencyVerified = Boolean(user?.isAgencyVerified || user?.agencyMembership?.agency_id?.status === "approved");

  // Creator state
  const [dailyHours, setDailyHours] = useState(4);
  const [avgViewers, setAvgViewers] = useState(2500);

  // Agency state
  const [creatorsCount, setCreatorsCount] = useState(20);
  const [avgRevPerCreator, setAvgRevPerCreator] = useState(4500);

  // Calculations
  const creatorEstMonthly = Math.round((dailyHours * avgViewers * 0.15 * 0.01) * 22 * 100) / 100;
  const agencyGrossRevenue = creatorsCount * avgRevPerCreator;
  const agencyEstCommission = Math.round(agencyGrossRevenue * 0.20);

  return (
    <Card className="p-6 md:p-8 bg-surface shadow-card border-brand/20">
      {/* Tab Selector */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-xl bg-surface-muted p-1 border border-border">
          <button
            type="button"
            onClick={() => setTab("CREATOR")}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === "CREATOR"
                ? "bg-surface text-brand shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <User className="h-4 w-4" />
            <span>Creator Earnings Estimator</span>
          </button>

          <button
            type="button"
            onClick={() => setTab("AGENCY")}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === "AGENCY"
                ? "bg-surface text-brand shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Agency Commission Calculator</span>
          </button>
        </div>
      </div>

      {tab === "CREATOR" ? (
        <div className="grid gap-8 md:grid-cols-2 items-center animate-in fade-in">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold text-text-primary mb-2">
                <span>Daily Streaming Hours</span>
                <span className="text-brand font-extrabold">{dailyHours} Hours / Day</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full accent-brand cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-text-primary mb-2">
                <span>Average Concurrent Viewers</span>
                <span className="text-brand font-extrabold">{avgViewers.toLocaleString()} Viewers</span>
              </div>
              <input
                type="range"
                min={100}
                max={20000}
                step={100}
                value={avgViewers}
                onChange={(e) => setAvgViewers(Number(e.target.value))}
                className="w-full accent-brand cursor-pointer"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-hover p-6 text-white text-center space-y-3 shadow-elevated">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-soft">Estimated Monthly Creator Income</span>
            <p className="text-4xl font-black">
              ${creatorEstMonthly.toLocaleString()} <span className="text-sm font-semibold">USD / mo</span>
            </p>
            <p className="text-xs text-brand-soft/80">
              Based on 80% creator gift split & average viewer retention.
            </p>
            {isCreatorVerified ? (
              <Link href="/creator" className="block pt-2">
                <Button variant="secondary" className="w-full bg-white text-brand hover:bg-white/90">
                  Open Creator Studio →
                </Button>
              </Link>
            ) : (
              <Link href="/creator-apply" className="block pt-2">
                <Button variant="secondary" className="w-full bg-white text-brand hover:bg-white/90">
                  Apply as Creator
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 items-center animate-in fade-in">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold text-text-primary mb-2">
                <span>Managed Creator Roster</span>
                <span className="text-brand font-extrabold">{creatorsCount} Creators</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={creatorsCount}
                onChange={(e) => setCreatorsCount(Number(e.target.value))}
                className="w-full accent-brand cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-text-primary mb-2">
                <span>Avg Gross Revenue per Creator</span>
                <span className="text-brand font-extrabold">${avgRevPerCreator.toLocaleString()} / mo</span>
              </div>
              <input
                type="range"
                min={500}
                max={20000}
                step={500}
                value={avgRevPerCreator}
                onChange={(e) => setAvgRevPerCreator(Number(e.target.value))}
                className="w-full accent-brand cursor-pointer"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-hover p-6 text-white text-center space-y-3 shadow-elevated">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-soft">Est. Agency Commission (20%)</span>
            <p className="text-4xl font-black">
              ${agencyEstCommission.toLocaleString()} <span className="text-sm font-semibold">USD / mo</span>
            </p>
            <p className="text-xs text-brand-soft/80">
              Gross Roster Revenue: ${agencyGrossRevenue.toLocaleString()} USD
            </p>
            {isAgencyVerified ? (
              <Link href="/agency" className="block pt-2">
                <Button variant="secondary" className="w-full bg-white text-brand hover:bg-white/90">
                  Open Agency Workspace →
                </Button>
              </Link>
            ) : (
              <Link href="/agency-apply" className="block pt-2">
                <Button variant="secondary" className="w-full bg-white text-brand hover:bg-white/90">
                  Apply as Partner Agency
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

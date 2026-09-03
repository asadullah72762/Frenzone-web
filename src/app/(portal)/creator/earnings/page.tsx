"use client";

import { Wallet, Gift, DollarSign, Users, Award, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { creatorService } from "@/features/creator/services/creator.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { creatorEarningsMock } from "@/mocks/creator-full.mock";
import { formatCurrency } from "@/lib/formatting";

export default function CreatorEarningsPage() {
  const { data: earningsData, isLoading } = useAsyncData(
    () => creatorService.getEarnings(),
    [],
    400
  );

  const data = earningsData || creatorEarningsMock;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Creator Revenue & Earnings Breakdown
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Track earnings generated from live stream gifts, fan tips, club subscriptions, and referral bonuses.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Lifetime Earnings"
          value={formatCurrency(data.totalEarnings)}
          detail="Backend verified gross revenue"
          icon={<Wallet className="h-5 w-5" />}
        />
        <StatCard
          label="Available for Payout"
          value={formatCurrency(data.availableForPayout)}
          detail="Ready for immediate withdrawal"
          trend={{ value: "+12.8%", positive: true }}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          label="Pending Clearance"
          value={formatCurrency(data.pendingClearance)}
          detail="Clears on 15th of next month"
          icon={<Calendar className="h-5 w-5" />}
        />
      </div>

      {/* Revenue Sources Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Sources (August 2026)</CardTitle>
            <CardDescription>
              Distribution of stream income by channel source.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-2">
            {data.sources.map((src, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-text-primary">{src.category}</span>
                  <span className="font-bold text-brand">{formatCurrency(src.amount)} ({src.percentage}%)</span>
                </div>
                <ProgressBar value={src.percentage} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stream Rewards Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Stream Gift Tiers & Bonus Policy</CardTitle>
            <CardDescription>
              Frenzone gift conversion rates and monthly performance bonuses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="rounded-lg border border-border bg-surface-muted/50 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary">Virtual Coins to USD Ratio</span>
                <span className="font-bold text-brand">100 Coins = $1.00 USD</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary">Frenzone Creator Split</span>
                <span className="font-bold text-success">80% Creator Share</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary">Referral Bonus Rate</span>
                <span className="font-bold text-success">10% Recurring Share</span>
              </div>
            </div>

            <p className="text-xs text-text-muted">
              Note: Financial calculations are authoritative and processed on backend settlement servers.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Earnings Statement Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase font-semibold text-text-muted bg-surface-muted/50">
                <tr>
                  <th className="px-4 py-3">Billing Period</th>
                  <th className="px-4 py-3">Gifts</th>
                  <th className="px-4 py-3">Tips</th>
                  <th className="px-4 py-3">Subscriptions</th>
                  <th className="px-4 py-3">Referral Bonus</th>
                  <th className="px-4 py-3 text-right">Total Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {data.history.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-text-primary">{row.period}</td>
                    <td className="px-4 py-3 text-text-secondary">{formatCurrency(row.gifts)}</td>
                    <td className="px-4 py-3 text-text-secondary">{formatCurrency(row.tips)}</td>
                    <td className="px-4 py-3 text-text-secondary">{formatCurrency(row.subscriptions)}</td>
                    <td className="px-4 py-3 text-text-secondary">{formatCurrency(row.referralBonus)}</td>
                    <td className="px-4 py-3 text-right font-bold text-success">{formatCurrency(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { DollarSign, ShieldCheck, FileText, Download, RefreshCw, AlertCircle, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { agencyService } from "@/features/agency/services/agency.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { formatCurrency } from "@/lib/formatting";
import { StatCardSkeleton, CardSkeleton } from "@/components/ui/skeleton";

export default function AgencyCommissionsPage() {
  const { data: comm, isLoading, error, refetch } = useAsyncData(
    () => agencyService.getCommissions(),
    [],
    400
  );

  const data = comm || {
    period: "Current Billing Cycle",
    grossRevenue: { amount: "0.00", currency: "USD" },
    agencyCommissionRatePercentage: 20,
    grossCommissionAmount: { amount: "0.00", currency: "USD" },
    platformFees: { amount: "0.00", currency: "USD" },
    netPayoutAmount: { amount: "0.00", currency: "USD" },
    breakdownPerCreator: [],
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-border pb-4 space-y-2">
          <div className="h-8 w-64 animate-pulse rounded bg-surface-muted" />
          <div className="h-4 w-96 animate-pulse rounded bg-surface-muted" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <CardSkeleton />
      </div>
    );
  }

  if (error && !comm) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive-soft/10 p-8 text-center max-w-lg mx-auto mt-12">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">Unable to load Commission Statements</h3>
        <p className="text-sm text-text-muted mt-1 mb-6">
          {error.message || "An unexpected error occurred while fetching commission data."}
        </p>
        <Button variant="primary" onClick={refetch} icon={<RefreshCw className="h-4 w-4" />}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Agency Commission Statements
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Detailed breakdown of your 20% agency commission split per managed creator.
          </p>
        </div>
        <Button variant="secondary" size="sm" icon={<Download className="h-4 w-4" />}>
          Export Statement CSV
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Gross Creator Revenue"
          value={formatCurrency(data.grossRevenue)}
          detail="Total stream revenue across roster"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          label="Agency Commission Rate"
          value={`${data.agencyCommissionRatePercentage}%`}
          detail="Standard Agency Tier Split"
          icon={<ShieldCheck className="h-5 w-5" />}
        />
        <StatCard
          label="Net Settlement Amount"
          value={formatCurrency(data.netPayoutAmount)}
          detail={`After platform fees (${formatCurrency(data.platformFees)})`}
          trend={{ value: "Confirmed", positive: true }}
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      {/* Per Creator Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Split Breakdown per Creator ({data.period})</CardTitle>
          <CardDescription>
            Authoritative backend-settled revenue splits for the current billing period.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.breakdownPerCreator.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-text-muted">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-text-primary">No creator earnings recorded yet</p>
              <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto">
                Once affiliated creators in your roster complete live streams, revenue splits will be automatically calculated and displayed here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-xs uppercase font-semibold text-text-muted bg-surface-muted/50">
                  <tr>
                    <th className="px-4 py-3">Creator Name</th>
                    <th className="px-4 py-3">Gross Earned</th>
                    <th className="px-4 py-3">Agency Split %</th>
                    <th className="px-4 py-3 text-right">Agency Commission Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {data.breakdownPerCreator.map((row) => (
                    <tr key={row.creatorId} className="hover:bg-surface-muted/30 transition-colors">
                      <td className="px-4 py-3 font-semibold text-text-primary">
                        {row.creatorName}
                        <span className="block text-xs font-normal text-text-muted">@{row.username}</span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{formatCurrency(row.grossEarned)}</td>
                      <td className="px-4 py-3 text-text-secondary">{row.agencyCommissionRatePercentage || 20}%</td>
                      <td className="px-4 py-3 text-right font-bold text-success">{formatCurrency(row.commissionEarned)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

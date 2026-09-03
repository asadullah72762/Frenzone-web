"use client";

import { DollarSign, ShieldCheck, FileText, Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { agencyService } from "@/features/agency/services/agency.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { agencyCommissionsMock } from "@/mocks/agency-full.mock";
import { formatCurrency } from "@/lib/formatting";

export default function AgencyCommissionsPage() {
  const { data: comm, isLoading } = useAsyncData(
    () => agencyService.getCommissions(),
    [],
    400
  );

  const data = comm || agencyCommissionsMock;

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
                    <td className="px-4 py-3 font-semibold text-text-primary">{row.creatorName}</td>
                    <td className="px-4 py-3 text-text-secondary">{formatCurrency(row.grossEarned)}</td>
                    <td className="px-4 py-3 text-text-secondary">20%</td>
                    <td className="px-4 py-3 text-right font-bold text-success">{formatCurrency(row.commissionEarned)}</td>
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

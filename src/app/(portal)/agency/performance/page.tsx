"use client";

import { BarChart3, Clock, Users, DollarSign, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { ChartSkeleton } from "@/components/ui/skeleton";
import { BarChart } from "@/components/ui/bar-chart";
import { agencyService } from "@/features/agency/services/agency.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { agencyPerformanceMock } from "@/mocks/agency-full.mock";
import { formatCurrency } from "@/lib/formatting";

export default function AgencyPerformancePage() {
  const { data: perf, isLoading } = useAsyncData(
    () => agencyService.getPerformance(),
    [],
    500
  );

  const data = perf || agencyPerformanceMock;

  if (isLoading) return <ChartSkeleton />;

  const chartItems = data.monthlyTrends.map((item) => ({
    label: item.month,
    value: item.grossRevenue,
    subLabel: `$${item.commission.toLocaleString()}`,
    tooltipText: `${item.month}: $${item.grossRevenue.toLocaleString()} Gross ($${item.commission.toLocaleString()} Commission)`,
  }));

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Agency Aggregate Performance Analytics
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Network-wide streaming metrics, creator activity trends, and gross revenue splits.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Agency Live Hours"
          value={`${data.totalLiveHoursAggregate}h`}
          detail={`Across ${data.totalCreatorCount} managed creators`}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          label="Avg Hours / Creator"
          value={`${data.avgHoursPerCreator}h`}
          detail="Average monthly live stream time"
          trend={{ value: "+8.2%", positive: true }}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Gross Creator Revenue"
          value={formatCurrency(data.grossCreatorRevenue)}
          detail="Total stream earnings generated"
          trend={{ value: "+16.5%", positive: true }}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          label="Net Agency Commission"
          value={formatCurrency(data.netAgencyCommission)}
          detail="20% agency contract cut"
          trend={{ value: "+18.0%", positive: true }}
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      {/* Monthly Trends Bar Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Agency Network Growth Trend (Last 5 Months)</CardTitle>
              <CardDescription>
                Gross streaming revenue generated vs Net Agency Commission (20%).
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2 text-xs text-text-muted font-medium">
              <Calendar className="h-4 w-4" />
              <span>Aug 2026</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BarChart data={chartItems} formatValue={(v) => `$${v.toLocaleString()}`} />
        </CardContent>
      </Card>

      {/* Category Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stream Category Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase font-semibold text-text-muted bg-surface-muted/50">
                <tr>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Creators Count</th>
                  <th className="px-4 py-3">Total Live Hours</th>
                  <th className="px-4 py-3 text-right">Gross Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {data.categoryBreakdown.map((cat, i) => (
                  <tr key={i} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-text-primary">{cat.category}</td>
                    <td className="px-4 py-3 text-text-secondary">{cat.creatorsCount} Creators</td>
                    <td className="px-4 py-3 text-text-secondary">{cat.hoursStreamed}h</td>
                    <td className="px-4 py-3 text-right font-bold text-success">{formatCurrency(cat.revenue)}</td>
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

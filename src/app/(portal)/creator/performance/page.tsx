"use client";

import { BarChart3, Clock, Users, Flame, Eye, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { ChartSkeleton } from "@/components/ui/skeleton";
import { BarChart } from "@/components/ui/bar-chart";
import { creatorService } from "@/features/creator/services/creator.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { creatorPerformanceMock } from "@/mocks/creator-full.mock";

export default function CreatorPerformancePage() {
  const { data: perf, isLoading } = useAsyncData(
    () => creatorService.getPerformance(),
    [],
    500
  );

  const data = perf || creatorPerformanceMock;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <ChartSkeleton />
      </div>
    );
  }

  const chartItems = data.trendData.map((item) => ({
    label: item.date,
    value: item.viewers,
    subLabel: `${item.hours}h`,
    tooltipText: `${item.date}: ${item.viewers.toLocaleString()} Viewers (${item.hours} hrs streamed)`,
  }));

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Streaming Performance & Analytics
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Track viewer retention, stream duration, peak concurrence, and audience engagement trends.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Stream Hours"
          value={`${data.totalHoursStreamed}h`}
          detail={`Across ${data.totalStreamSessions} stream sessions`}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          label="Total Viewers Count"
          value={data.totalViewersCount.toLocaleString()}
          detail="Cumulative viewer impressions"
          trend={{ value: "+18.4%", positive: true }}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Peak Concurrent Viewers"
          value={data.peakConcurrentViewers.toLocaleString()}
          detail="Highest simultaneous viewers"
          trend={{ value: "+22.0%", positive: true }}
          icon={<Flame className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Watch Time"
          value={`${data.avgWatchTimeMinutes} min`}
          detail={`Engagement rate: ${data.engagementRate}%`}
          trend={{ value: "+5.1%", positive: true }}
          icon={<Eye className="h-5 w-5" />}
        />
      </div>

      {/* Viewer Trends Chart Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Viewer & Stream Duration Trend (Last 30 Days)</CardTitle>
              <CardDescription>
                Visualizing peak concurrent audience during live streaming sessions.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border border-border bg-surface-muted px-3 py-1.5 text-xs font-semibold text-text-secondary">
              <Calendar className="h-3.5 w-3.5" />
              <span>August 2026</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BarChart data={chartItems} formatValue={(v) => `${v.toLocaleString()} Viewers`} />
        </CardContent>
      </Card>

      {/* Recent Sessions Breakdown */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-brand" />
            <CardTitle>Recent Session Summary Log</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase font-semibold text-text-muted bg-surface-muted/50">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Stream Duration</th>
                  <th className="px-4 py-3">Peak Viewers</th>
                  <th className="px-4 py-3 text-right">Gifts Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {data.trendData.map((item, i) => (
                  <tr key={i} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-text-primary">{item.date}, 2026</td>
                    <td className="px-4 py-3 text-text-secondary">{item.hours} Hours</td>
                    <td className="px-4 py-3 text-text-secondary font-semibold">{item.viewers.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-success font-semibold">+{item.gifts} Coins</td>
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

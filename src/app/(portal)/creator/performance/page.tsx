"use client";

import { useState } from "react";
import { BarChart3, Clock, Users, Flame, Eye, Calendar, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { ChartSkeleton } from "@/components/ui/skeleton";
import { BarChart } from "@/components/ui/bar-chart";
import { Button } from "@/components/ui/button";
import { creatorService } from "@/features/creator/services/creator.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import type { CreatorPerformance } from "@/types/creator";

export default function CreatorPerformancePage() {
  const [range, setRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  const { data: perf, isLoading, error, refetch } = useAsyncData(
    () => creatorService.getPerformance(range),
    [range],
    200
  );

  const emptyPerformance: CreatorPerformance = {
    totalHoursStreamed: 0,
    totalStreamSessions: 0,
    totalViewersCount: 0,
    peakConcurrentViewers: 0,
    avgWatchTimeMinutes: 0,
    engagementRate: 0,
    trendData: [],
  };

  const data = perf || emptyPerformance;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <ChartSkeleton />
      </div>
    );
  }

  if (error && !perf) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive-soft/10 p-8 text-center max-w-lg mx-auto mt-12">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">Unable to load Streaming Performance</h3>
        <p className="text-sm text-text-muted mt-1 mb-6">
          {error.message || "An unexpected error occurred while fetching your telemetry."}
        </p>
        <Button variant="primary" onClick={refetch} icon={<RefreshCw className="h-4 w-4" />}>
          Try Again
        </Button>
      </div>
    );
  }

  const chartItems = data.trendData.map((item) => ({
    label: item.date,
    value: item.viewers,
    subLabel: `${item.hours}h`,
    tooltipText: `${item.date}: ${item.viewers.toLocaleString()} Viewers (${item.hours} hrs streamed)`,
  }));

  const rangeLabels = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    "all": "All Time",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Streaming Performance & Analytics
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Track viewer retention, stream duration, peak concurrence, and audience engagement trends.
          </p>
        </div>

        {/* Time Range Filter Controls */}
        <div className="flex items-center space-x-1 rounded-lg border border-border bg-surface p-1 shadow-sm self-start sm:self-auto">
          {(["7d", "30d", "90d", "all"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                range === r
                  ? "bg-brand text-white shadow-xs"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
              }`}
            >
              {r === "7d" ? "7D" : r === "30d" ? "30D" : r === "90d" ? "90D" : "All"}
            </button>
          ))}
        </div>
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
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Peak Concurrent Viewers"
          value={data.peakConcurrentViewers.toLocaleString()}
          detail="Highest simultaneous viewers"
          icon={<Flame className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Watch Time"
          value={`${data.avgWatchTimeMinutes} min`}
          detail={`Engagement rate: ${data.engagementRate}%`}
          icon={<Eye className="h-5 w-5" />}
        />
      </div>

      {/* Viewer Trends Chart Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle>Viewer & Stream Duration Trend ({rangeLabels[range]})</CardTitle>
              <CardDescription>
                Visualizing audience impressions and duration during live streaming sessions.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border border-border bg-surface-muted px-3 py-1 text-xs font-semibold text-text-secondary self-start sm:self-auto">
              <Calendar className="h-3.5 w-3.5" />
              <span>{rangeLabels[range]}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {data.trendData.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-text-muted">
                <BarChart3 className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-text-primary">No streaming sessions recorded</p>
              <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                Completed live broadcasts within this time range will plot audience impressions and peak viewers here.
              </p>
            </div>
          ) : (
            <BarChart data={chartItems} formatValue={(v) => `${v.toLocaleString()} Viewers`} />
          )}
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
          {data.trendData.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-muted">
              No individual sessions recorded for the selected time range.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-xs uppercase font-semibold text-text-muted bg-surface-muted/50">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Stream Duration</th>
                    <th className="px-4 py-3">Peak Viewers</th>
                    <th className="px-4 py-3 text-right">Gifts Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {[...data.trendData].reverse().map((item, i) => (
                    <tr key={i} className="hover:bg-surface-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-text-primary">{item.date}</td>
                      <td className="px-4 py-3 text-text-secondary">{item.hours} Hours</td>
                      <td className="px-4 py-3 text-text-secondary font-semibold">{item.viewers.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-success font-semibold">+{item.gifts} Coins</td>
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

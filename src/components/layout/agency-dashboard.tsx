"use client";

import { Users, Clock, Wallet, DollarSign, UserPlus, Bell, ArrowUpRight, ShieldCheck, Building2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge } from "@/components/feedback/status-badge";
import { StatCardSkeleton, CardSkeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatting";
import type { AgencyDashboard } from "@/types/agency";

export function AgencyDashboardView({
  data,
  isLoading = false,
}: {
  data: AgencyDashboard;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-muted" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Agency Management Portal
            </h1>
            <StatusBadge status="ACTIVE" customLabel="Verified Agency" />
          </div>
          <p className="text-text-secondary mt-1 text-sm">
            Monitor your managed creator network, stream hours, 20% agency commissions, and payout schedules.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="primary" size="sm" icon={<UserPlus className="h-4 w-4" />}>
            Invite Creator
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Managed Creators"
          value={`${data.activeCreators} / ${data.totalCreators}`}
          detail={`${data.activeCreators} creators currently active`}
          trend={{ value: "+3 this month", positive: true }}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Agency Live Hours"
          value={`${data.liveHours}h`}
          detail={`Target: ${data.liveHoursTarget}h aggregate monthly`}
          trend={{ value: "+14.2%", positive: true }}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          label="Est. Monthly Commission"
          value={formatCurrency(data.estimatedCommissionMonth)}
          detail="20% agency partnership split"
          trend={{ value: "+18.0%", positive: true }}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          label="Pending Agency Payout"
          value={formatCurrency(data.pendingPayout)}
          detail="Scheduled for 15th disbursement"
          icon={<Wallet className="h-5 w-5" />}
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stream Target Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Agency Aggregate Streaming Goals</CardTitle>
              <Building2 className="h-5 w-5 text-brand" />
            </div>
            <CardDescription>
              Overall network streaming completion rate across all managed creators.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-text-primary">Monthly Network Live Hours Goal</span>
                <span className="text-brand font-bold">{data.liveHours}h of {data.liveHoursTarget}h</span>
              </div>
              <ProgressBar value={Math.min(100, Math.round((data.liveHours / data.liveHoursTarget) * 100))} />
            </div>

            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-text-primary">Creator Content Compliance Rate</span>
                <span className="text-brand font-bold">{data.contentCompletion}%</span>
              </div>
              <ProgressBar value={data.contentCompletion} />
            </div>
          </CardContent>
        </Card>

        {/* Agency Alerts Feed */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-brand" />
                <CardTitle>Recent Network Alerts</CardTitle>
              </div>
              <span className="text-xs text-text-muted">Live Updates</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border-subtle">
              {data.recentAlerts.map((alt) => (
                <div key={alt.id} className="py-3 flex items-start justify-between first:pt-0 last:pb-0">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-text-primary">{alt.title}</span>
                      <StatusBadge status={alt.type === "success" ? "APPROVED" : alt.type === "warning" ? "PARTIAL" : "ACTIVE"} customLabel={alt.type} />
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">{alt.message}</p>
                    <span className="text-[10px] text-text-muted mt-1 block">{alt.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

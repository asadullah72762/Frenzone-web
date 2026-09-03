"use client";

import { useState } from "react";
import {
  Clock,
  Video,
  Wallet,
  Users,
  Copy,
  Check,
  QrCode,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge } from "@/components/feedback/status-badge";
import { formatCurrency } from "@/lib/formatting";
import { StatCardSkeleton, CardSkeleton } from "@/components/ui/skeleton";
import type { CreatorDashboard } from "@/types/creator";

export function CreatorDashboardView({
  data,
  isLoading = false,
}: {
  data: CreatorDashboard;
  isLoading?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(data.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 animate-pulse rounded bg-surface-muted" />
            <div className="h-4 w-72 animate-pulse rounded bg-surface-muted" />
          </div>
        </div>
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Creator Hub Overview
            </h1>
            <StatusBadge status={data.complianceStatus} />
          </div>
          <p className="text-text-secondary mt-1 text-sm">
            Monitor your streaming progress, daily targets, earnings, and network growth.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="secondary" size="sm" onClick={() => setShowQrModal(true)} icon={<QrCode className="h-4 w-4" />}>
            Share QR Code
          </Button>
          <Button variant="primary" size="sm" icon={<Video className="h-4 w-4" />}>
            Go Live Studio
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Live Stream Hours"
          value={`${data.liveHours} / ${data.liveHoursTarget}h`}
          detail={`${Math.round((data.liveHours / data.liveHoursTarget) * 100)}% of monthly target completed`}
          trend={{ value: "+12.4%", positive: true }}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          label="Content Progress"
          value={`${data.contentProgress}%`}
          detail="On track for monthly compliance tier"
          trend={{ value: "+8%", positive: true }}
          icon={<Video className="h-5 w-5" />}
        />
        <StatCard
          label="Available Earnings"
          value={formatCurrency(data.availableEarnings)}
          detail={`Pending: ${formatCurrency(data.pendingEarnings)}`}
          trend={{ value: "+18.2%", positive: true }}
          icon={<Wallet className="h-5 w-5" />}
        />
        <StatCard
          label="Total Viewers Reached"
          value={data.totalViewers.toLocaleString()}
          detail="Across last 30 streaming sessions"
          trend={{ value: "+24.5%", positive: true }}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Middle Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stream Targets Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Stream Goals & Targets</CardTitle>
              <ShieldCheck className="h-5 w-5 text-brand" />
            </div>
            <CardDescription>
              Maintain active status by reaching your monthly hours and content goals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span className="text-text-primary">Monthly Live Stream Target</span>
                <span className="text-brand font-semibold">{data.liveHours}h of {data.liveHoursTarget}h</span>
              </div>
              <ProgressBar value={Math.min(100, Math.round((data.liveHours / data.liveHoursTarget) * 100))} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span className="text-text-primary">Content Quality & Requirements</span>
                <span className="text-brand font-semibold">{data.contentProgress}%</span>
              </div>
              <ProgressBar value={data.contentProgress} />
            </div>

            <div className="rounded-lg bg-surface-muted/70 p-4 border border-border flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-success animate-ping" />
                <span className="text-xs font-semibold text-text-primary">Current Stream Quality Tier: Premium HD</span>
              </div>
              <span className="text-xs text-text-muted">1080p @ 60fps</span>
            </div>
          </CardContent>
        </Card>

        {/* Referral Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Creator Referral Network</CardTitle>
              <TrendingUp className="h-5 w-5 text-brand" />
            </div>
            <CardDescription>
              Earn recurring bonuses by inviting eligible creators to Frenzone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Your Referral Link</label>
              <div className="mt-1.5 flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={data.referralLink}
                  className="w-full rounded-lg border border-border bg-surface-muted px-3.5 py-2 text-xs font-mono text-text-primary outline-none"
                />
                <Button variant="secondary" size="sm" onClick={handleCopyLink} icon={copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}>
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg border border-border p-3.5 bg-surface-muted/40">
                <span className="text-xs text-text-muted">Referral Code</span>
                <p className="text-sm font-bold text-brand mt-0.5">{data.referralCode}</p>
              </div>
              <div className="rounded-lg border border-border p-3.5 bg-surface-muted/40">
                <span className="text-xs text-text-muted">Commission Bonus</span>
                <p className="text-sm font-bold text-success mt-0.5">10% Recurring</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed Stream */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-brand" />
              <CardTitle>Recent Stream & Account Activity</CardTitle>
            </div>
            <span className="text-xs font-medium text-text-muted">Updated in real-time</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border-subtle">
            {data.recentActivities.map((act) => (
              <div key={act.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-brand" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{act.title}</p>
                    <span className="text-xs text-text-muted">{act.timestamp}</span>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-text-muted" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* QR Code Modal Preview */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-modal border border-border text-center">
            <h3 className="text-lg font-bold text-text-primary">Your Referral QR Code</h3>
            <p className="text-xs text-text-secondary mt-1">Scan to open creator signup with code {data.referralCode}</p>

            <div className="my-6 mx-auto flex h-48 w-48 items-center justify-center rounded-xl border-2 border-brand/20 bg-brand-soft/30 p-4">
              <QrCode className="h-32 w-32 text-brand" />
            </div>

            <Button variant="primary" className="w-full" onClick={() => setShowQrModal(false)}>
              Close Preview
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

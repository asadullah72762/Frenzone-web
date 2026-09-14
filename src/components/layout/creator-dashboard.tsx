"use client";

import { useState, useEffect } from "react";
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
  Coins,
  Building2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge } from "@/components/feedback/status-badge";
import { formatCurrency } from "@/lib/formatting";
import { StatCardSkeleton, CardSkeleton } from "@/components/ui/skeleton";
import { ShareQrModal } from "@/features/creator/components/share-qr-modal";
import { LiveAccessDeniedModal } from "@/features/creator/components/live-access-denied-modal";
import { creatorService } from "@/features/creator/services/creator.service";
import { creatorLiveService } from "@/features/creator/services/creator-live.service";
import { getCanonicalReferralUrl } from "@/lib/referral/referral-url";
import type { CreatorDashboard, CreatorActivityItem } from "@/types/creator";

function getActivityIcon(type: CreatorActivityItem["type"]) {
  switch (type) {
    case "stream":
      return { icon: Video, bg: "bg-purple-500/10", color: "text-purple-600 dark:text-purple-400" };
    case "earning":
      return { icon: Coins, bg: "bg-emerald-500/10", color: "text-emerald-600 dark:text-emerald-400" };
    case "referral":
      return { icon: Users, bg: "bg-blue-500/10", color: "text-blue-600 dark:text-blue-400" };
    case "agency":
      return { icon: Building2, bg: "bg-amber-500/10", color: "text-amber-600 dark:text-amber-400" };
    case "compliance":
      return { icon: ShieldCheck, bg: "bg-indigo-500/10", color: "text-indigo-600 dark:text-indigo-400" };
    default:
      return { icon: Activity, bg: "bg-brand/10", color: "text-brand" };
  }
}

export function CreatorDashboardView({
  data,
  isLoading = false,
  onRefresh,
}: {
  data: CreatorDashboard;
  isLoading?: boolean;
  onRefresh?: () => void;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isCheckingLive, setIsCheckingLive] = useState(false);
  const [deniedModal, setDeniedModal] = useState<{
    isOpen: boolean;
    reason?: string;
    message?: string;
  }>({ isOpen: false });
  const [activities, setActivities] = useState<CreatorActivityItem[]>(data?.recentActivities || []);
  const [isRefreshingActivities, setIsRefreshingActivities] = useState(false);

  const handleGoLive = async () => {
    setIsCheckingLive(true);
    try {
      const status = await creatorLiveService.checkLiveStatus();
      if (status.authorized) {
        router.push("/creator/studio");
      } else {
        setDeniedModal({
          isOpen: true,
          reason: status.reason || "not_eligible",
          message: status.message || "You are not authorized to broadcast from the Live Studio at this time.",
        });
      }
    } catch (err: any) {
      setDeniedModal({
        isOpen: true,
        reason: "not_eligible",
        message: err?.message || "Failed to verify broadcasting eligibility. Please try again later.",
      });
    } finally {
      setIsCheckingLive(false);
    }
  };

  useEffect(() => {
    if (data?.recentActivities) {
      setActivities(data.recentActivities);
    }
  }, [data?.recentActivities]);

  const handleRefreshActivities = async () => {
    setIsRefreshingActivities(true);
    try {
      if (onRefresh) {
        onRefresh();
      }
      const updated = await creatorService.getActivities();
      if (updated && updated.length > 0) {
        setActivities(updated);
      }
    } catch (err) {
      console.error("Failed to refresh activities:", err);
    } finally {
      setIsRefreshingActivities(false);
    }
  };

  const canonicalReferralUrl = getCanonicalReferralUrl(data?.referralCode, data?.referralLink);

  const handleCopyLink = () => {
    if (!canonicalReferralUrl) return;
    navigator.clipboard.writeText(canonicalReferralUrl);
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
          <Button
            variant="primary"
            size="sm"
            onClick={handleGoLive}
            disabled={isCheckingLive}
            icon={isCheckingLive ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
          >
            {isCheckingLive ? "Checking Access..." : "Go Live Studio"}
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {(() => {
        const formattedLiveTime = data.liveDurationFormatted
          ? data.liveDurationFormatted
          : data.liveHours > 0
          ? `${data.liveHours}h`
          : "0m";
        const totalSec = data.liveDurationSeconds ?? (data.liveHours * 3600);
        const targetSec = (data.liveHoursTarget || 40) * 3600;
        const liveTargetProgressPct = Math.min(100, Math.round((totalSec / targetSec) * 100));

        return (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Live Stream Hours"
              value={`${formattedLiveTime} / ${data.liveHoursTarget}h`}
              detail={`${liveTargetProgressPct}% of monthly target completed`}
              trend={data.trends?.liveHours || { value: "0%", positive: true }}
              icon={<Clock className="h-5 w-5" />}
            />
            <StatCard
              label="Content Progress"
              value={`${data.contentProgress}%`}
              detail="On track for monthly compliance tier"
              trend={data.trends?.contentProgress || { value: "0%", positive: true }}
              icon={<Video className="h-5 w-5" />}
            />
            <StatCard
              label="Available Earnings"
              value={formatCurrency(data.availableEarnings)}
              detail={`Pending: ${formatCurrency(data.pendingEarnings)}`}
              trend={data.trends?.earnings || { value: "0%", positive: true }}
              icon={<Wallet className="h-5 w-5" />}
            />
            <StatCard
              label="Total Viewers Reached"
              value={data.totalViewers.toLocaleString()}
              detail="Across last 30 streaming sessions"
              trend={data.trends?.viewers || { value: "0%", positive: true }}
              icon={<Users className="h-5 w-5" />}
            />
          </div>
        );
      })()}

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
                <span className="text-brand font-semibold">
                  {data.liveDurationFormatted ? data.liveDurationFormatted : `${data.liveHours}h`} of {data.liveHoursTarget}h
                </span>
              </div>
              <ProgressBar
                value={Math.min(
                  100,
                  Math.round(
                    ((data.liveDurationSeconds ?? (data.liveHours * 3600)) / ((data.liveHoursTarget || 40) * 3600)) * 100
                  )
                )}
              />
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
                  value={canonicalReferralUrl}
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
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-text-primary">Recent Stream & Account Activity</CardTitle>
                <CardDescription className="text-xs text-text-muted">
                  Authoritative live activity from your streams, network referrals & agency
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed
              </span>
              <button
                type="button"
                onClick={handleRefreshActivities}
                disabled={isRefreshingActivities}
                title="Refresh activities feed"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors disabled:opacity-50 cursor-pointer"
                aria-label="Refresh activity feed"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshingActivities ? "animate-spin text-brand" : ""}`} />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {(!activities || activities.length === 0) ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-text-muted">
                <Activity className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-text-primary">No recent activities yet</p>
              <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto">
                Your completed live sessions, stream tips, and network referrals will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {activities.map((act) => {
                const iconConfig = getActivityIcon(act.type);
                const IconComponent = iconConfig.icon;
                return (
                  <Link
                    key={act.id}
                    href={act.link || "/creator"}
                    className="group flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-border hover:bg-surface-muted/60 transition-all"
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconConfig.bg} ${iconConfig.color}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate group-hover:text-brand transition-colors">
                          {act.title}
                        </p>
                        {act.subtitle ? (
                          <p className="text-xs text-text-muted truncate mt-0.5">{act.subtitle}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">
                      <span className="text-xs font-medium text-text-muted whitespace-nowrap">{act.timestamp}</span>
                      <ArrowUpRight className="h-4 w-4 text-text-muted group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share QR Code Production Modal */}
      <ShareQrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        initialCode={data?.referralCode}
        initialLink={canonicalReferralUrl}
      />

      {/* Live Access Denied / Status Modal */}
      <LiveAccessDeniedModal
        isOpen={deniedModal.isOpen}
        onClose={() => setDeniedModal({ isOpen: false })}
        reason={deniedModal.reason}
        message={deniedModal.message}
      />
    </div>
  );
}

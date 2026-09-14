"use client";

import { useState, useMemo } from "react";
import { Link2, Copy, Check, QrCode, Users, DollarSign, Award, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/status-badge";
import { DataTable, Column } from "@/components/tables/data-table";
import { creatorService } from "@/features/creator/services/creator.service";
import { referralService } from "@/features/referrals/services/referral.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { formatCurrency } from "@/lib/formatting";
import { ShareQrModal } from "@/features/creator/components/share-qr-modal";
import { getCanonicalReferralUrl } from "@/lib/referral/referral-url";
import type { CreatorReferralItem } from "@/types/creator";

export default function CreatorReferralsPage() {
  const {
    data: referrals,
    isLoading: isLoadingReferrals,
    error: referralsError,
    refetch: refetchReferrals,
  } = useAsyncData(() => creatorService.getReferrals(), [], 400);

  const {
    data: liveCodeData,
    refetch: refetchCode,
  } = useAsyncData(() => referralService.getCode(), [], 400);

  const {
    data: liveStatsData,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useAsyncData(() => referralService.getStats(), [], 400);

  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Map fallback items from stats.recentReferrals if creator roster is empty/unreachable
  const statsReferrals = useMemo<CreatorReferralItem[]>(() => {
    if (!liveStatsData?.recentReferrals || !Array.isArray(liveStatsData.recentReferrals)) {
      return [];
    }
    return liveStatsData.recentReferrals.map((r: any) => {
      const u = r.referred_user_id || {};
      const fullName = `${u.firstname || ""} ${u.lastname || ""}`.trim();
      const displayName = fullName
        ? `${fullName} (@${u.username || "creator"})`
        : (u.username ? `@${u.username}` : "Referred Creator");
      return {
        id: r._id?.toString() || r.id || String(Math.random()),
        referredUser: displayName,
        avatarUrl: u.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || u.username || "C")}&background=8b5cf6&color=fff`,
        joinedDate: r.createdAt ? new Date(r.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        status: (r.status === "qualified" ? "ACTIVE" : "PENDING") as "ACTIVE" | "PENDING",
        earningsGenerated: {
          amount: "0.00",
          currency: "USD",
        },
      };
    });
  }, [liveStatsData?.recentReferrals]);

  const dataList: CreatorReferralItem[] =
    referrals && referrals.length > 0
      ? referrals
      : statsReferrals.length > 0
      ? statsReferrals
      : [];

  const isLoading = isLoadingReferrals && isLoadingStats;
  const hasError = Boolean(referralsError && statsError && dataList.length === 0);

  const code = liveCodeData?.referralCode || "";
  const link = getCanonicalReferralUrl(code, liveCodeData?.referralLink || liveCodeData?.referralUrl);

  const handleCopy = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefreshAll = () => {
    refetchReferrals();
    refetchCode();
    refetchStats();
  };

  const columns: Column<CreatorReferralItem>[] = [
    {
      key: "referredUser",
      header: "Referred Creator",
      render: (item) => (
        <div className="flex items-center space-x-3">
          {item.avatarUrl ? (
            <img
              src={item.avatarUrl}
              alt={item.referredUser}
              className="h-9 w-9 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand font-semibold text-xs border border-border">
              {(item.referredUser || "C").slice(0, 2).toUpperCase()}
            </div>
          )}
          <span className="font-semibold text-text-primary">{item.referredUser}</span>
        </div>
      ),
    },
    { key: "joinedDate", header: "Joined Date" },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "earningsGenerated",
      header: "Commission Earned",
      align: "right",
      render: (item) => (
        <span className="font-bold text-success">
          {formatCurrency(item.earningsGenerated)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Referral Network & Earnings
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Invite creators to join Frenzone and earn 10% recurring bonuses on their stream revenue.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Referred Creators"
          value={liveStatsData?.stats?.totalReferred ?? dataList.length}
          detail={`${liveStatsData?.stats?.qualifiedCount ?? 0} qualified creators (CR: ${liveStatsData?.stats?.conversionRate ?? "0%"})`}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Total Referral Earnings"
          value={formatCurrency({
            amount: liveStatsData?.stats?.totalReferralEarningsUSD ?? "0.00",
            currency: "USD",
          })}
          detail="10% recurring referral split"
          trend={liveStatsData?.stats?.trend}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          label="Referral Tier"
          value={liveStatsData?.stats?.referralTier ?? "Starter"}
          detail={liveStatsData?.stats?.tierDetail ?? "Invite creators to unlock tier bonuses"}
          icon={<Award className="h-5 w-5" />}
        />
      </div>

      {/* Link Generator Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link2 className="h-5 w-5 text-brand" />
              <CardTitle>Your Verified Referral Link</CardTitle>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowQr(true)}
              icon={<QrCode className="h-4 w-4" />}
              disabled={!code}
            >
              View QR Code
            </Button>
          </div>
          <CardDescription>
            Share this link across social channels. Invited creators automatically connect to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              readOnly
              value={link || "Generating your referral link..."}
              className="w-full rounded-lg border border-border bg-surface-muted px-4 py-2.5 text-xs font-mono text-text-primary outline-none"
            />
            <Button
              variant="primary"
              onClick={handleCopy}
              disabled={!link}
              icon={copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            >
              {copied ? "Copied" : "Copy Link"}
            </Button>
          </div>
          <p className="text-xs text-text-muted">
            Referral Code: <strong className="text-brand">{code || "—"}</strong>
          </p>
        </CardContent>
      </Card>

      {/* Error state if data load fails and no cached items available */}
      {hasError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive-soft/10 p-8 text-center max-w-lg mx-auto my-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">Unable to load Creator Referrals</h3>
          <p className="text-sm text-text-muted mt-1 mb-6">
            {referralsError?.message || statsError?.message || "An unexpected error occurred while fetching your referral roster."}
          </p>
          <Button variant="primary" onClick={handleRefreshAll} icon={<RefreshCw className="h-4 w-4" />}>
            Try Again
          </Button>
        </div>
      ) : null}

      {/* Referred Creators DataTable */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">Referred Creators Roster</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefreshAll}
            icon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />}
          >
            Refresh Roster
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={dataList}
          isLoading={isLoading}
          searchKey="referredUser"
          searchPlaceholder="Search referred creators..."
          filterKey="status"
          filterOptions={[
            { label: "All Statuses", value: "ALL" },
            { label: "Active", value: "ACTIVE" },
            { label: "Pending", value: "PENDING" },
          ]}
          emptyTitle="No referred creators yet"
          emptyDescription="Share your referral link above to invite creators and earn recurring bonuses on their stream revenue."
          emptyIcon={Users}
        />
      </div>

      {/* Production Share QR Modal */}
      <ShareQrModal
        isOpen={showQr}
        onClose={() => setShowQr(false)}
        initialCode={code}
        initialLink={link}
      />
    </div>
  );
}

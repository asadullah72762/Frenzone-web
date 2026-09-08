"use client";

import { useState } from "react";
import { Link2, Copy, Check, QrCode, Users, DollarSign, Award } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/status-badge";
import { DataTable, Column } from "@/components/tables/data-table";
import { creatorService } from "@/features/creator/services/creator.service";
import { referralService } from "@/features/referrals/services/referral.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { formatCurrency } from "@/lib/formatting";
import type { CreatorReferralItem } from "@/types/creator";

export default function CreatorReferralsPage() {
  const { data: referrals, isLoading } = useAsyncData(
    () => creatorService.getReferrals(),
    [],
    400
  );

  const { data: liveCodeData } = useAsyncData(
    () => referralService.getCode(),
    [],
    400
  );

  const { data: liveStatsData } = useAsyncData(
    () => referralService.getStats(),
    [],
    400
  );

  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const dataList = referrals || [];
  const code = liveCodeData?.referralCode || "";
  const link = liveCodeData?.referralLink || (code ? `https://frenzone.live/join/${code}` : "");

  const handleCopy = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      {/* Referred Creators DataTable */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-text-primary">Referred Creators Roster</h2>
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

      {/* QR Modal */}
      {showQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-modal border border-border text-center">
            <h3 className="text-lg font-bold text-text-primary">Referral QR Code</h3>
            <p className="text-xs text-text-secondary mt-1">Code: {code}</p>
            <div className="my-6 mx-auto flex h-52 w-52 items-center justify-center rounded-xl border-2 border-brand/20 bg-white p-3 shadow-inner">
              {link ? (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(link)}`}
                  alt={`Referral QR for ${code}`}
                  className="h-44 w-44 rounded-lg object-contain"
                />
              ) : (
                <QrCode className="h-32 w-32 text-brand" />
              )}
            </div>
            <Button variant="primary" className="w-full" onClick={() => setShowQr(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

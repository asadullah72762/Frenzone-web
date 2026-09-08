"use client";

import { useState } from "react";
import { Link2, Copy, Check, QrCode, Building2, Users, TrendingUp, Award, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { agencyService } from "@/features/agency/services/agency.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { StatCardSkeleton, CardSkeleton } from "@/components/ui/skeleton";

export default function AgencyReferralsPage() {
  const { data: refData, isLoading, error, refetch } = useAsyncData(
    () => agencyService.getReferrals(),
    [],
    400
  );

  const [copied, setCopied] = useState(false);

  const code = refData?.referralCode || "";
  const link = refData?.referralLink || (code ? `https://frenzone.live/agency-apply?ref=${code}` : "");

  const handleCopy = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  if (error && !refData) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive-soft/10 p-8 text-center max-w-lg mx-auto mt-12">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">Unable to load Partner Referral Network</h3>
        <p className="text-sm text-text-muted mt-1 mb-6">
          {error.message || "An unexpected error occurred while fetching your agency referral data."}
        </p>
        <Button variant="primary" onClick={refetch} icon={<RefreshCw className="h-4 w-4" />}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Agency Partner Referral Network
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Refer sub-agencies and creator managers to Frenzone to build your master agency network.
        </p>
      </div>

      {/* Network Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Referred Partners"
          value={String(refData?.totalReferred ?? 0)}
          detail="Total registered sub-agency partners"
          icon={<Building2 className="h-5 w-5" />}
        />
        <StatCard
          label="Qualified Active Partners"
          value={String(refData?.qualifiedCount ?? 0)}
          detail="Agencies actively managing creators"
          trend={{ value: "Active", positive: true }}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Recurring Network Split"
          value={`${refData?.commissionBonusPercentage ?? 10}%`}
          detail="Bonus on managed creator gross"
          trend={{ value: "Perpetual", positive: true }}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Link2 className="h-5 w-5 text-brand" />
            <CardTitle>Master Agency Partner Link</CardTitle>
          </div>
          <CardDescription>
            Agencies applying through your partner link connect under your master agency network.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              readOnly
              value={link}
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
            Agency Partner Code: <strong className="text-brand font-mono">{code || "N/A"}</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

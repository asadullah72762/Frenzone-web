"use client";

import { CreatorDashboardView } from "@/components/layout/creator-dashboard";
import { creatorService } from "@/features/creator/services/creator.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function CreatorPage() {
  const { data, isLoading, error, refetch } = useAsyncData(
    () => creatorService.getDashboard(),
    [],
    300
  );

  if (error && !data) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive-soft/10 p-8 text-center max-w-lg mx-auto mt-12">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">Unable to load Creator Dashboard</h3>
        <p className="text-sm text-text-muted mt-1 mb-6">
          {error.message || "An unexpected error occurred while fetching your streaming telemetry."}
        </p>
        <Button variant="primary" onClick={refetch} icon={<RefreshCw className="h-4 w-4" />}>
          Try Again
        </Button>
      </div>
    );
  }

  const defaultEmptyDashboard = {
    liveHours: 0,
    liveHoursTarget: 40,
    contentProgress: 0,
    complianceStatus: "PARTIAL" as const,
    availableEarnings: { amount: "0.00", currency: "USD" },
    pendingEarnings: { amount: "0.00", currency: "USD" },
    totalViewers: 0,
    referralCode: "",
    referralLink: "",
    recentActivities: [],
  };

  return <CreatorDashboardView data={data || defaultEmptyDashboard} isLoading={isLoading} />;
}

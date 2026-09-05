"use client";

import { AgencyDashboardView } from "@/components/layout/agency-dashboard";
import { agencyService } from "@/features/agency/services/agency.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";

const emptyAgencyDashboard = {
  activeCreators: 0,
  totalCreators: 0,
  liveHours: 0,
  liveHoursTarget: 40,
  estimatedCommissionMonth: { amount: "0.00", currency: "USD" },
  pendingPayout: { amount: "0.00", currency: "USD" },
  contentCompletion: 0,
  recentAlerts: [
    {
      id: "init-alert",
      title: "Agency Workspace Ready",
      message: "Invite creators to your roster to start monitoring live hours and commissions.",
      timestamp: "Today",
      type: "info" as const,
    },
  ],
};

export default function AgencyPage() {
  const { data, isLoading } = useAsyncData(
    () => agencyService.getDashboard(),
    [],
    400
  );

  return <AgencyDashboardView data={data || emptyAgencyDashboard} isLoading={isLoading} />;
}

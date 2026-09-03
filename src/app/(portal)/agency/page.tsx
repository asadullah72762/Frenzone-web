"use client";

import { AgencyDashboardView } from "@/components/layout/agency-dashboard";
import { agencyService } from "@/features/agency/services/agency.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { agencyDashboardMock } from "@/mocks/agency-full.mock";

export default function AgencyPage() {
  const { data, isLoading } = useAsyncData(
    () => agencyService.getDashboard(),
    [],
    500
  );

  return <AgencyDashboardView data={data || agencyDashboardMock} isLoading={isLoading} />;
}

"use client";

import { CreatorDashboardView } from "@/components/layout/creator-dashboard";
import { creatorService } from "@/features/creator/services/creator.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { creatorDashboardMock } from "@/mocks/creator-full.mock";

export default function CreatorPage() {
  const { data, isLoading } = useAsyncData(
    () => creatorService.getDashboard(),
    [],
    500
  );

  return <CreatorDashboardView data={data || creatorDashboardMock} isLoading={isLoading} />;
}

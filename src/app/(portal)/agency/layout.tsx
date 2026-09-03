"use client";

import type { ReactNode } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { agencyNavigation } from "@/config/navigation";
export default function AgencyLayout({ children }: { children: ReactNode }) {
  return (
    <PortalShell product="Agency" links={agencyNavigation}>
      {children}
    </PortalShell>
  );
}

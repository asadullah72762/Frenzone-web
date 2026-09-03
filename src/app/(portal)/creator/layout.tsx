"use client";

import type { ReactNode } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { creatorNavigation } from "@/config/navigation";
export default function CreatorLayout({ children }: { children: ReactNode }) {
  return (
    <PortalShell product="Creator" links={creatorNavigation}>
      {children}
    </PortalShell>
  );
}

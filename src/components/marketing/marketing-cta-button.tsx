"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Radio, Building2 } from "lucide-react";
import { authService } from "@/features/auth/services/auth.service";

interface MarketingCtaButtonProps {
  type: "creator" | "agency";
  defaultText: string;
  defaultHref: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  icon?: boolean;
}

export function MarketingCtaButton({
  type,
  defaultText,
  defaultHref,
  className = "",
  variant = "primary",
  icon = true,
}: MarketingCtaButtonProps) {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    authService
      .getSession()
      .then((s) => setSession(s))
      .catch(() => setSession(null));
  }, []);

  const user = session?.user;
  const isCreatorVerified = Boolean(
    user?.isCreatorVerified || user?.isCreator || user?.creatorStatus === "approved"
  );
  const isAgencyVerified = Boolean(
    user?.isAgencyVerified || user?.agencyMembership?.agency_id?.status === "approved"
  );

  let targetHref = defaultHref;
  let targetText = defaultText;
  let IconComponent = ArrowRight;

  if (type === "creator" && isCreatorVerified) {
    targetHref = "/creator";
    targetText = "Open Creator Studio";
    IconComponent = Radio;
  } else if (type === "agency" && isAgencyVerified) {
    targetHref = "/agency";
    targetText = "Open Agency Workspace";
    IconComponent = Building2;
  }

  return (
    <Link href={targetHref} className={className}>
      <span>{targetText}</span>
      {icon && <IconComponent className="h-4 w-4 shrink-0" />}
    </Link>
  );
}

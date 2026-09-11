"use client";

import { useEffect, useRef } from "react";
import { referralService } from "@/features/referrals/services/referral.service";

interface ReferralScanTrackerProps {
  referralCode: string;
}

export function ReferralScanTracker({ referralCode }: ReferralScanTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!referralCode || trackedRef.current) return;
    trackedRef.current = true;

    // Fire non-blocking server scan tracking
    referralService.trackScan(referralCode).catch((err) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[ReferralScanTracker] Non-critical scan tracking error:", err);
      }
    });
  }, [referralCode]);

  return null;
}

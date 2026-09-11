import { apiClient } from "@/lib/api/client";
import { getCanonicalReferralUrl } from "@/lib/referral/referral-url";

export type ReferralCodeResponse = {
  success: boolean;
  creatorId?: string;
  referralCode: string;
  referralUrl: string;
  referralLink: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  trackingEnabled?: boolean;
};

export type ReferralStatsResponse = {
  success: boolean;
  stats: {
    totalReferred: number;
    qualifiedCount: number;
    totalScans?: number;
    conversionRate: string;
    totalReferralEarningsUSD?: string;
    referralTier?: string;
    tierDetail?: string;
    trend?: {
      value: string;
      positive: boolean;
    };
  };
  recentReferrals: any[];
};

export type TrackScanResponse = {
  success: boolean;
  valid: boolean;
  referralCode: string;
  creator?: {
    id: string;
    name: string;
    username: string;
  };
  recorded: boolean;
  isSelfScan?: boolean;
};

export const referralService = {
  async getCode(): Promise<ReferralCodeResponse> {
    const res = await apiClient.get<ReferralCodeResponse>("/referral/code");
    if (res && res.referralCode) {
      const canonicalUrl = getCanonicalReferralUrl(res.referralCode, res.referralUrl || res.referralLink);
      return {
        ...res,
        referralUrl: canonicalUrl,
        referralLink: canonicalUrl,
      };
    }
    return res;
  },

  async getStats(): Promise<ReferralStatsResponse> {
    return apiClient.get<ReferralStatsResponse>("/referral/stats");
  },

  async trackScan(referralCode: string): Promise<TrackScanResponse> {
    try {
      return await apiClient.post<TrackScanResponse>("/referral/track-scan", {
        referralCode,
      });
    } catch (err) {
      console.warn("Non-blocking referral scan tracking failure:", err);
      return { success: false, valid: false, referralCode, recorded: false };
    }
  },

  async getContext(referralCode: string) {
    const canonicalUrl = getCanonicalReferralUrl(referralCode);
    return {
      code: referralCode,
      shareUrl: canonicalUrl,
    };
  },

  async recordClick(referralCode: string) {
    return this.trackScan(referralCode);
  },
};

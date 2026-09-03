import { apiClient } from "@/lib/api/client";

export type ReferralCodeResponse = {
  success: boolean;
  referralCode: string;
  referralLink: string;
};

export type ReferralStatsResponse = {
  success: boolean;
  stats: {
    totalReferred: number;
    qualifiedCount: number;
    conversionRate: string;
  };
  recentReferrals: any[];
};

export const referralService = {
  async getCode(): Promise<ReferralCodeResponse> {
    return apiClient.get<ReferralCodeResponse>("/referral/code");
  },

  async getStats(): Promise<ReferralStatsResponse> {
    return apiClient.get<ReferralStatsResponse>("/referral/stats");
  },

  async getContext(referralCode: string) {
    return {
      code: referralCode,
      shareUrl: `https://frenzone.live/join/${referralCode}`,
    };
  },

  async recordClick(_referralCode: string) {
    return Promise.resolve();
  },
};

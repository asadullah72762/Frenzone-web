import { apiClient } from "@/lib/api/client";
import {
  creatorComplianceMock,
  creatorReferralsMock,
  creatorEarningsMock,
  creatorPayoutsMock,
  creatorAgencyContractMock,
  creatorMarketingKitsMock,
  creatorSupportTicketsMock,
} from "@/mocks/creator-full.mock";
import type {
  CreatorDashboard,
  CreatorProfile,
  CreatorPerformance,
  CreatorCompliance,
  CreatorReferralItem,
  CreatorEarningsBreakdown,
  CreatorPayoutItem,
  CreatorAgencyContract,
  CreatorMarketingKit,
  SupportTicket,
} from "@/types/creator";

export class CreatorService {
  async getDashboard(): Promise<CreatorDashboard> {
    try {
      const res = await apiClient.get<{ success: boolean; data: any }>("/creator/dashboard");
      if (res?.data) {
        const d = res.data;
        const stats = d.stats || {};
        return {
          liveHours: d.liveHours ?? Math.round((stats.totalStreams || 0) * 1.5),
          liveHoursTarget: d.liveHoursTarget ?? 40,
          contentProgress: d.contentProgress ?? (stats.totalStreams > 0 ? Math.min(Math.round((stats.totalStreams / 20) * 100), 100) : 0),
          complianceStatus: d.complianceStatus ?? (d.isApproved ? "COMPLETED" : "PARTIAL"),
          availableEarnings: d.availableEarnings || {
            amount: Number(stats.estimatedEarningsUSD || 0).toFixed(2),
            currency: "USD",
          },
          pendingEarnings: d.pendingEarnings || {
            amount: "0.00",
            currency: "USD",
          },
          totalViewers: d.totalViewers ?? (stats.followersCount || stats.totalLikes || 0),
          referralCode: d.referralCode || "",
          referralLink: d.referralLink || "",
          recentActivities: Array.isArray(d.recentActivities) ? d.recentActivities : [],
        };
      }
    } catch (err) {
      console.error("Failed to load creator dashboard:", err);
      throw err;
    }
    throw new Error("Failed to load creator dashboard");
  }

  async getProfile(): Promise<CreatorProfile> {
    try {
      const res = await apiClient.get<{ success: boolean; data?: any }>("/creator/profile");
      if (res?.data) {
        const p = res.data;
        return {
          id: p.id || "",
          username: p.username || "",
          fullName: p.fullName || "",
          email: p.email || "",
          phone: p.phone || "",
          country: p.country || "",
          language: p.language || "English",
          bio: p.bio || "",
          avatarUrl: p.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          categories: p.categories || [],
          socialLinks: {
            instagram: p.socialLinks?.instagram || "",
            tiktok: p.socialLinks?.tiktok || "",
            youtube: p.socialLinks?.youtube || "",
          },
          paymentMethod: p.paymentMethod || {
            type: "PAYPAL",
            accountHolder: p.fullName || p.username || "",
            details: p.email || "Not configured",
          },
          agreementSignedDate: p.agreementSignedDate || "",
          status: p.status || "INACTIVE",
        };
      }
    } catch (err) {
      console.error("Failed to load creator profile:", err);
      throw err;
    }
    throw new Error("Failed to load creator profile");
  }

  async updateProfile(updates: Partial<CreatorProfile>): Promise<CreatorProfile> {
    const payload: any = {
      fullName: updates.fullName,
      phone: updates.phone,
      country: updates.country,
      language: updates.language,
      bio: updates.bio,
      socialLinks: updates.socialLinks,
    };
    const res = await apiClient.patch<{ success: boolean; data: CreatorProfile }>("/creator/profile", payload);
    if (res?.data) {
      return res.data;
    }
    throw new Error("Failed to update creator profile");
  }

  async uploadAvatar(file: File): Promise<{ success: boolean; avatarUrl: string }> {
    const formData = new FormData();
    formData.append("image", file);
    return apiClient.postFormData<{ success: boolean; avatarUrl: string }>("/creator/avatar", formData);
  }

  async getPerformance(range = "30d"): Promise<CreatorPerformance> {
    try {
      const res = await apiClient.get<{ success: boolean; data: CreatorPerformance }>(
        `/creator/performance?range=${encodeURIComponent(range)}`
      );
      if (res?.data) {
        return res.data;
      }
    } catch (err) {
      console.error("Failed to load creator performance:", err);
      throw err;
    }
    throw new Error("Failed to load creator performance");
  }

  async getCompliance(): Promise<CreatorCompliance> {
    return Promise.resolve(creatorComplianceMock);
  }

  async getReferrals(): Promise<CreatorReferralItem[]> {
    return Promise.resolve(creatorReferralsMock);
  }

  async getEarnings(): Promise<CreatorEarningsBreakdown> {
    return Promise.resolve(creatorEarningsMock);
  }

  async getPayouts(): Promise<CreatorPayoutItem[]> {
    return Promise.resolve(creatorPayoutsMock);
  }

  async getAgencyContract(): Promise<CreatorAgencyContract> {
    return Promise.resolve(creatorAgencyContractMock);
  }

  async getMarketingKits(): Promise<CreatorMarketingKit[]> {
    return Promise.resolve(creatorMarketingKitsMock);
  }

  async getSupportTickets(): Promise<SupportTicket[]> {
    return Promise.resolve(creatorSupportTicketsMock);
  }

  async createSupportTicket(subject: string, category: string): Promise<SupportTicket> {
    const newTicket: SupportTicket = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject,
      category: category as any,
      status: "OPEN",
      priority: "MEDIUM",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      messagesCount: 1,
    };
    return Promise.resolve(newTicket);
  }
}

export const creatorService = new CreatorService();

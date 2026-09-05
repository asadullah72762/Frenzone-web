import { apiClient } from "@/lib/api/client";
import {
  creatorEarningsMock,
  creatorPayoutsMock,
  creatorAgencyContractMock,
  creatorMarketingKitsMock,
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
  SupportTicketMessage,
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

  async getCompliance(month?: string): Promise<CreatorCompliance> {
    try {
      const url = month ? `/creator/compliance?month=${encodeURIComponent(month)}` : "/creator/compliance";
      const res = await apiClient.get<{ success: boolean; data: CreatorCompliance }>(url);
      if (res?.data) {
        return res.data;
      }
    } catch (err) {
      console.error("Failed to load creator compliance:", err);
      throw err;
    }
    throw new Error("Failed to load creator compliance");
  }

  async getReferrals(): Promise<CreatorReferralItem[]> {
    try {
      const res = await apiClient.get<{ success: boolean; data: CreatorReferralItem[] }>("/creator/referrals");
      if (res?.data && Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch (err) {
      console.error("Failed to load creator referrals:", err);
      throw err;
    }
  }

  async getEarnings(): Promise<CreatorEarningsBreakdown> {
    try {
      const res = await apiClient.get<{ success: boolean; data: CreatorEarningsBreakdown }>("/creator/earnings");
      if (res?.data) {
        return res.data;
      }
    } catch (err) {
      console.error("Failed to load creator earnings:", err);
      throw err;
    }
    throw new Error("Failed to load creator earnings");
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
    try {
      const res = await apiClient.get<{ success: boolean; data: SupportTicket[] }>("/creator/support/tickets");
      if (res?.data) {
        return res.data;
      }
    } catch (err) {
      console.error("Failed to load support tickets:", err);
      throw err;
    }
    throw new Error("Failed to load support tickets");
  }

  async createSupportTicket(subject: string, category: string, message: string): Promise<SupportTicket> {
    try {
      const res = await apiClient.post<{ success: boolean; data: SupportTicket }>("/creator/support/tickets", {
        subject,
        category,
        message,
      });
      if (res?.data) {
        return res.data;
      }
    } catch (err) {
      console.error("Failed to create support ticket:", err);
      throw err;
    }
    throw new Error("Failed to create support ticket");
  }

  async getTicketDetails(ticketId: string): Promise<SupportTicket> {
    try {
      const res = await apiClient.get<{ success: boolean; data: SupportTicket }>(
        `/creator/support/tickets/${encodeURIComponent(ticketId)}`
      );
      if (res?.data) {
        return res.data;
      }
    } catch (err) {
      console.error("Failed to load ticket details:", err);
      throw err;
    }
    throw new Error("Failed to load ticket details");
  }

  async sendTicketMessage(ticketId: string, message: string): Promise<SupportTicketMessage> {
    try {
      const res = await apiClient.post<{ success: boolean; data: SupportTicketMessage }>(
        `/creator/support/tickets/${encodeURIComponent(ticketId)}/messages`,
        { message }
      );
      if (res?.data) {
        return res.data;
      }
    } catch (err) {
      console.error("Failed to send ticket message:", err);
      throw err;
    }
    throw new Error("Failed to send ticket message");
  }

  async closeTicket(ticketId: string): Promise<{ id: string; status: string }> {
    try {
      const res = await apiClient.patch<{ success: boolean; data: { id: string; status: string } }>(
        `/creator/support/tickets/${encodeURIComponent(ticketId)}/close`
      );
      if (res?.data) {
        return res.data;
      }
    } catch (err) {
      console.error("Failed to close ticket:", err);
      throw err;
    }
    throw new Error("Failed to close ticket");
  }
}

export const creatorService = new CreatorService();

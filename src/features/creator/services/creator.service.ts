import { apiClient } from "@/lib/api/client";
import { getCanonicalReferralUrl } from "@/lib/referral/referral-url";
import {
  creatorEarningsMock,
  creatorPayoutsMock,
  creatorAgencyContractMock,
  creatorMarketingKitsMock,
} from "@/mocks/creator-full.mock";
import type {
  CreatorDashboard,
  CreatorActivityItem,
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
          liveHours: typeof d.liveHours === "number" ? d.liveHours : 0,
          liveDurationSeconds: d.liveDurationSeconds ?? 0,
          liveDurationFormatted: d.liveDurationFormatted || undefined,
          liveHoursTarget: d.liveHoursTarget ?? 40,
          contentProgress: typeof d.contentProgress === "number" ? d.contentProgress : 0,
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
          referralLink: getCanonicalReferralUrl(d.referralCode, d.referralLink),
          recentActivities: Array.isArray(d.recentActivities) ? d.recentActivities : [],
          trends: d.trends || undefined,
        };
      }
    } catch (err: any) {
      console.error("Failed to load creator dashboard:", err?.message || err);
      throw err;
    }
    throw new Error("Failed to load creator dashboard");
  }

  async getActivities(): Promise<CreatorActivityItem[]> {
    try {
      const res = await apiClient.get<{ success: boolean; activities?: CreatorActivityItem[] }>("/creator/activities");
      if (res?.activities && Array.isArray(res.activities)) {
        return res.activities;
      }
      return [];
    } catch (err: any) {
      console.error("Failed to load creator activities:", err?.message || err);
      return [];
    }
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
          avatarUrl: p.avatarUrl || "",
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
      if (typeof window !== "undefined") {
        try {
          const cachedUser = localStorage.getItem("user");
          if (cachedUser) {
            const parsed = JSON.parse(cachedUser);
            if (updates.fullName) {
              const parts = updates.fullName.trim().split(/\s+/);
              parsed.firstname = parts[0] || parsed.firstname;
              parsed.lastname = parts.slice(1).join(" ") || parsed.lastname;
              parsed.displayName = updates.fullName;
            }
            localStorage.setItem("user", JSON.stringify(parsed));
          }
          window.dispatchEvent(new CustomEvent("frenzone_profile_updated", { detail: res.data }));
        } catch (e) {
          // ignore cache sync error
        }
      }
      return res.data;
    }
    throw new Error("Failed to update creator profile");
  }

  async uploadAvatar(file: File): Promise<{ success: boolean; avatarUrl: string }> {
    const formData = new FormData();
    formData.append("image", file);
    const res = await apiClient.postFormData<{ success: boolean; avatarUrl: string }>("/creator/avatar", formData);
    if (res?.avatarUrl && typeof window !== "undefined") {
      try {
        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
          const parsed = JSON.parse(cachedUser);
          parsed.profilePicture = res.avatarUrl;
          localStorage.setItem("user", JSON.stringify(parsed));
        }
        window.dispatchEvent(new CustomEvent("frenzone_profile_updated", { detail: res }));
      } catch (e) {
        // ignore cache sync error
      }
    }
    return res;
  }

  async getPerformance(range = "30d"): Promise<CreatorPerformance> {
    try {
      const res = await apiClient.get<{ success: boolean; data: CreatorPerformance }>(
        `/creator/performance?range=${encodeURIComponent(range)}`
      );
      if (res?.data) {
        return res.data;
      }
    } catch (err: any) {
      console.error("Failed to load creator performance:", err?.message || err);
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
    } catch (err: any) {
      console.error("Failed to load creator compliance:", err?.message || err);
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
    } catch (err: any) {
      console.warn("Notice: creator referrals query:", err?.message || err);
      return [];
    }
  }

  async getEarnings(): Promise<CreatorEarningsBreakdown> {
    try {
      const res = await apiClient.get<{ success: boolean; data: CreatorEarningsBreakdown }>("/creator/earnings");
      if (res?.data) {
        return res.data;
      }
    } catch (err: any) {
      console.error("Failed to load creator earnings:", err?.message || err);
      throw err;
    }
    throw new Error("Failed to load creator earnings");
  }

  async getPayouts(): Promise<CreatorPayoutItem[]> {
    return Promise.resolve(creatorPayoutsMock);
  }

  async getAgencyContract(): Promise<CreatorAgencyContract> {
    try {
      const res = await apiClient.get<{ success: boolean; data: CreatorAgencyContract }>("/creator/agency");
      if (res?.data) {
        return res.data;
      }
    } catch (err: any) {
      console.error("Failed to load creator agency contract:", err?.message || err);
      throw err;
    }
    throw new Error("Failed to load agency partnership details");
  }

  async respondAgencyInvite(relationshipId: string, action: "accept" | "reject"): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.post<{ success: boolean; message: string }>("/creator/agency/respond", {
        relationship_id: relationshipId,
        action,
      });
      return res;
    } catch (err) {
      console.error("Failed to respond to agency invitation:", err);
      throw err;
    }
  }

  async getMarketingKits(category?: string): Promise<CreatorMarketingKit[]> {
    try {
      const endpoint = category && category !== "All"
        ? `/creator/marketing/kits?category=${encodeURIComponent(category)}`
        : "/creator/marketing/kits";
      const res = await apiClient.get<{ success: boolean; data: CreatorMarketingKit[] }>(endpoint);
      if (res?.data && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (err) {
      console.error("Failed to load marketing kits:", err);
      throw err;
    }
    throw new Error("Failed to load creator marketing kits");
  }

  async downloadMarketingKit(assetId: string, fileName?: string): Promise<void> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

      const res = await fetch(`${baseUrl}/creator/marketing/kits/${encodeURIComponent(assetId)}/download`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        throw new Error(`Download failed with status ${res.status}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || `${assetId}-brand-asset.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download marketing asset:", err);
      throw err;
    }
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

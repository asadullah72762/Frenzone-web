import { apiClient } from "@/lib/api/client";
import {
  agencyDashboardMock,
  agencyProfileMock,
  agencyCreatorsMock,
  agencyInvitationsMock,
  agencyPerformanceMock,
  agencyCommissionsMock,
  agencySupportTicketsMock,
} from "@/mocks/agency-full.mock";
import type {
  AgencyDashboard,
  AgencyProfile,
  AgencyCreatorItem,
  AgencyInvitation,
  AgencyPerformance,
  AgencyCommissionReport,
  AgencyInvoice,
  AgencyPayoutAccount,
  UpdateAgencyPayoutAccountInput,
  AgencyDisbursementItem,
  CreatorSearchResult,
  AgencyReferralData,
} from "@/types/agency";
import type { Money } from "@/types/common";
import type { SupportTicket } from "@/types/creator";

export class AgencyService {
  async getDashboard(): Promise<AgencyDashboard> {
    try {
      const res = await apiClient.get<{ success: boolean; data: AgencyDashboard }>("/agency/dashboard");
      if (res?.data) {
        return res.data;
      }
    } catch (err) {
      console.error("Failed to load agency dashboard:", err);
      throw err;
    }
    throw new Error("Failed to load agency dashboard");
  }

  async getProfile(): Promise<AgencyProfile> {
    try {
      const res = await apiClient.get<{ success: boolean; agency: any; memberRole: string }>("/agency/profile");
      if (res?.agency) {
        return {
          id: res.agency._id || agencyProfileMock.id,
          agencyName: res.agency.agency_name || agencyProfileMock.agencyName,
          country: res.agency.country || agencyProfileMock.country,
          businessAddress: res.agency.business_address || agencyProfileMock.businessAddress,
          registrationNumber: res.agency.registration_number || agencyProfileMock.registrationNumber,
          taxId: res.agency.tax_id || agencyProfileMock.taxId,
          website: res.agency.website || agencyProfileMock.website,
          mainContactName: res.agency.main_contact?.name || agencyProfileMock.mainContactName,
          mainContactEmail: res.agency.main_contact?.email || agencyProfileMock.mainContactEmail,
          mainContactPhone: res.agency.main_contact?.phone || agencyProfileMock.mainContactPhone,
          targetMarkets: agencyProfileMock.targetMarkets,
          creatorsManagedCount: agencyProfileMock.creatorsManagedCount,
          status: res.agency.status === "approved" ? "VERIFIED" : "PENDING_VERIFICATION",
        };
      }
    } catch {
      // Graceful fallback to mock data when unauthenticated or offline
    }
    return Promise.resolve(agencyProfileMock);
  }

  async updateProfile(updates: Partial<AgencyProfile>): Promise<AgencyProfile> {
    return Promise.resolve({ ...agencyProfileMock, ...updates });
  }

  async getCreators(): Promise<AgencyCreatorItem[]> {
    try {
      const res = await apiClient.get<{ success: boolean; roster: AgencyCreatorItem[] }>("/agency/roster");
      if (res?.roster && Array.isArray(res.roster)) {
        return res.roster;
      }
    } catch (err) {
      console.error("Failed to load agency roster:", err);
      throw err;
    }
    return [];
  }

  async getInvitations(): Promise<AgencyInvitation[]> {
    try {
      const res = await apiClient.get<{ success: boolean; data: AgencyInvitation[] }>("/agency/invitations");
      if (res?.data && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (err) {
      console.error("Failed to load agency invitations:", err);
      throw err;
    }
    return [];
  }

  async sendInvitation(username: string, email: string): Promise<AgencyInvitation> {
    const res = await apiClient.post<{ success: boolean; relationship: any; creator: any }>("/agency/invite-creator", {
      username,
      email,
    });
    if (res?.relationship) {
      return {
        id: res.relationship._id,
        creatorUsername: res.creator?.username || username,
        creatorEmail: email || res.creator?.email || `${username}@frenzone.live`,
        sentDate: new Date().toISOString().split("T")[0],
        expiresDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
        status: "PENDING_CONSENT",
      };
    }
    throw new Error("Failed to send invitation");
  }

  async cancelInvitation(id: string): Promise<void> {
    await apiClient.delete(`/agency/invitations/${id}`);
  }

  async getPerformance(): Promise<AgencyPerformance> {
    try {
      const res = await apiClient.get<{ success: boolean; data: AgencyPerformance }>("/agency/performance");
      if (res?.data) {
        return res.data;
      }
    } catch (err) {
      console.error("Failed to load agency performance:", err);
      throw err;
    }
    throw new Error("Failed to load agency performance");
  }

  async searchCreators(query: string, page = 1, limit = 10): Promise<{ creators: CreatorSearchResult[]; total: number }> {
    try {
      const res = await apiClient.get<{ success: boolean; creators: CreatorSearchResult[]; total: number }>(
        `/agency/creators/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      );
      if (res?.creators) {
        return {
          creators: res.creators,
          total: res.total || res.creators.length,
        };
      }
      return { creators: [], total: 0 };
    } catch (err) {
      console.error("Failed to search creators:", err);
      return { creators: [], total: 0 };
    }
  }

  async getCommissions(): Promise<AgencyCommissionReport> {
    try {
      const res = await apiClient.get<{ success: boolean; data: AgencyCommissionReport }>("/agency/commissions");
      if (res?.data) {
        return res.data;
      }
    } catch (err) {
      console.error("Failed to load agency commissions:", err);
      throw err;
    }
    throw new Error("Failed to load agency commissions");
  }

  async getReferrals(): Promise<AgencyReferralData> {
    try {
      const res = await apiClient.get<{ success: boolean; data: AgencyReferralData }>("/agency/referrals");
      if (res?.data) {
        return res.data;
      }
    } catch (err) {
      console.error("Failed to load agency referrals:", err);
      throw err;
    }
    throw new Error("Failed to load agency referrals");
  }

  async getInvoices(): Promise<{
    invoices: AgencyInvoice[];
    summary: { totalInvoiced: Money; totalSettled: Money; totalPending: Money };
  }> {
    try {
      const res = await apiClient.get<{
        success: boolean;
        data: AgencyInvoice[];
        summary: { totalInvoiced: Money; totalSettled: Money; totalPending: Money };
      }>("/agency/invoices");
      if (res?.data && Array.isArray(res.data)) {
        return {
          invoices: res.data,
          summary: res.summary || {
            totalInvoiced: { amount: "0.00", currency: "USD" },
            totalSettled: { amount: "0.00", currency: "USD" },
            totalPending: { amount: "0.00", currency: "USD" },
          },
        };
      }
    } catch (err) {
      console.error("Failed to load agency invoices:", err);
      throw err;
    }
    throw new Error("Failed to load agency invoices");
  }

  async downloadInvoice(invoiceId: string, invoiceNumber: string): Promise<void> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
      const res = await fetch(`${baseUrl}/agency/invoices/${invoiceId}/download`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        throw new Error(`Invoice download failed: ${res.status}`);
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${invoiceNumber || "invoice"}.html`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Failed to download invoice document:", err);
      throw err;
    }
  }

  async getPayoutAccount(): Promise<AgencyPayoutAccount> {
    try {
      const res = await apiClient.get<{ success: boolean; data: AgencyPayoutAccount }>("/agency/payout-account");
      if (res?.data) {
        return res.data;
      }
    } catch (err) {
      console.error("Failed to load agency payout account:", err);
      throw err;
    }
    throw new Error("Failed to load agency payout account");
  }

  async updatePayoutAccount(data: UpdateAgencyPayoutAccountInput): Promise<AgencyPayoutAccount> {
    try {
      const res = await apiClient.put<{ success: boolean; message: string; data: AgencyPayoutAccount }>(
        "/agency/payout-account",
        data
      );
      if (res?.data) {
        return res.data;
      }
    } catch (err) {
      console.error("Failed to update payout account:", err);
      throw err;
    }
    throw new Error("Failed to update agency payout account");
  }

  async getDisbursements(): Promise<AgencyDisbursementItem[]> {
    try {
      const res = await apiClient.get<{ success: boolean; data: AgencyDisbursementItem[] }>("/agency/payouts/history");
      if (res?.data && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (err) {
      console.error("Failed to load disbursements:", err);
      throw err;
    }
    return [];
  }

  async getSupportTickets(): Promise<SupportTicket[]> {
    return Promise.resolve(agencySupportTicketsMock);
  }
}

export const agencyService = new AgencyService();

import { apiClient } from "@/lib/api/client";
import {
  agencyDashboardMock,
  agencyProfileMock,
  agencyCreatorsMock,
  agencyInvitationsMock,
  agencyPerformanceMock,
  agencyCommissionsMock,
  agencyInvoicesMock,
  agencyPayoutAccountMock,
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
} from "@/types/agency";
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

  async getCommissions(): Promise<AgencyCommissionReport> {
    return Promise.resolve(agencyCommissionsMock);
  }

  async getInvoices(): Promise<AgencyInvoice[]> {
    return Promise.resolve(agencyInvoicesMock);
  }

  async getPayoutAccount(): Promise<AgencyPayoutAccount> {
    return Promise.resolve(agencyPayoutAccountMock);
  }

  async getSupportTickets(): Promise<SupportTicket[]> {
    return Promise.resolve(agencySupportTicketsMock);
  }
}

export const agencyService = new AgencyService();

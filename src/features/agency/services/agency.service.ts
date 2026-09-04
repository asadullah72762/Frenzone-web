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
    return Promise.resolve(agencyDashboardMock);
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
      const res = await apiClient.get<{ success: boolean; roster: any[] }>("/agency/roster");
      if (res?.roster && res.roster.length > 0) {
        return res.roster.map((rel: any, idx: number) => {
          const creator = rel.creator_id || {};
          return {
            id: rel._id || `cr-${idx}`,
            creatorId: creator._id || `c-${idx}`,
            name: `${creator.firstname || ""} ${creator.lastname || ""}`.trim() || creator.username || `Creator ${idx + 1}`,
            username: creator.username || `creator_${idx}`,
            avatarUrl: creator.profilePicture || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80`,
            category: "General",
            monthlyLiveHours: 0,
            complianceRate: 100,
            monthlyRevenue: { amount: "0.00", currency: "USD" },
            agencyCommission: { amount: "0.00", currency: "USD" },
            status: rel.status === "active" ? "ACTIVE" : "INACTIVE",
            joinedDate: rel.createdAt ? new Date(rel.createdAt).toISOString().split("T")[0] : "Recently",
          };
        });
      }
    } catch {
      // Graceful fallback to mock data
    }
    return Promise.resolve(agencyCreatorsMock);
  }

  async getInvitations(): Promise<AgencyInvitation[]> {
    return Promise.resolve(agencyInvitationsMock);
  }

  async sendInvitation(username: string, email: string): Promise<AgencyInvitation> {
    try {
      const res = await apiClient.post<{ success: boolean; relationship: any; creator: any }>("/agency/invite-creator", {
        username,
      });
      if (res?.relationship) {
        return {
          id: res.relationship._id,
          creatorUsername: res.creator?.username || username,
          creatorEmail: email || `${username}@frenzone.live`,
          sentDate: new Date().toISOString().split("T")[0],
          expiresDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
          status: "PENDING_CONSENT",
        };
      }
    } catch {
      // Fallback
    }

    const newInv: AgencyInvitation = {
      id: `inv-${Math.floor(100 + Math.random() * 900)}`,
      creatorUsername: username,
      creatorEmail: email,
      sentDate: new Date().toISOString().split("T")[0],
      expiresDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      status: "PENDING_CONSENT",
    };
    return Promise.resolve(newInv);
  }

  async getPerformance(): Promise<AgencyPerformance> {
    return Promise.resolve(agencyPerformanceMock);
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

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
    return Promise.resolve(agencyProfileMock);
  }

  async updateProfile(updates: Partial<AgencyProfile>): Promise<AgencyProfile> {
    return Promise.resolve({ ...agencyProfileMock, ...updates });
  }

  async getCreators(): Promise<AgencyCreatorItem[]> {
    return Promise.resolve(agencyCreatorsMock);
  }

  async getInvitations(): Promise<AgencyInvitation[]> {
    return Promise.resolve(agencyInvitationsMock);
  }

  async sendInvitation(username: string, email: string): Promise<AgencyInvitation> {
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

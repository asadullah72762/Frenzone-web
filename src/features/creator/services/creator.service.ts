import {
  creatorDashboardMock,
  creatorProfileMock,
  creatorPerformanceMock,
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
    return Promise.resolve(creatorDashboardMock);
  }

  async getProfile(): Promise<CreatorProfile> {
    return Promise.resolve(creatorProfileMock);
  }

  async updateProfile(updates: Partial<CreatorProfile>): Promise<CreatorProfile> {
    return Promise.resolve({ ...creatorProfileMock, ...updates });
  }

  async getPerformance(): Promise<CreatorPerformance> {
    return Promise.resolve(creatorPerformanceMock);
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

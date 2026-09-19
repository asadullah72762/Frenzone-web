import type { Money } from "./common";

export type AgencyDashboard = {
  totalCreators: number;
  activeCreators: number;
  liveHours: number;
  liveHoursTarget: number;
  contentCompletion: number;
  pendingPayout: Money;
  estimatedCommissionMonth: Money;
  recentAlerts: {
    id: string;
    title: string;
    message: string;
    type: "info" | "warning" | "success";
    timestamp: string;
  }[];
  agency?: {
    id: string;
    name: string;
    status: "pending" | "approved" | "rejected" | "suspended" | string;
    isVerified: boolean;
  };
};

export type AgencyProfile = {
  id: string;
  agencyName: string;
  country: string;
  businessAddress: string;
  registrationNumber: string;
  taxId: string;
  website: string;
  mainContactName: string;
  mainContactEmail: string;
  mainContactPhone: string;
  targetMarkets: string[];
  creatorsManagedCount: number;
  status: "VERIFIED" | "PENDING_VERIFICATION" | "SUSPENDED";
};

export type AgencyCreatorItem = {
  id: string;
  creatorId: string;
  name: string;
  username: string;
  avatarUrl: string;
  category: string;
  monthlyLiveHours: number;
  complianceRate: number;
  monthlyRevenue: Money;
  agencyCommission: Money;
  status: "ACTIVE" | "INACTIVE" | "PENDING_TRANSFER";
  joinedDate: string;
};

export type AgencyInvitation = {
  id: string;
  creatorUsername: string;
  creatorEmail: string;
  sentDate: string;
  expiresDate: string;
  status: "PENDING_CONSENT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "EXPIRED";
};

export type AgencyPerformance = {
  totalLiveHoursAggregate: number;
  totalCreatorCount: number;
  avgHoursPerCreator: number;
  grossCreatorRevenue: Money;
  netAgencyCommission: Money;
  categoryBreakdown: {
    category: string;
    creatorsCount: number;
    hoursStreamed: number;
    revenue: Money;
  }[];
  monthlyTrends: {
    month: string;
    liveHours: number;
    grossRevenue: number;
    commission: number;
  }[];
};

export type AgencyCommissionReport = {
  period: string;
  grossRevenue: Money;
  agencyCommissionRatePercentage: number;
  grossCommissionAmount: Money;
  platformFees: Money;
  netPayoutAmount: Money;
  breakdownPerCreator: {
    creatorId: string;
    creatorName: string;
    username?: string;
    agencyCommissionRatePercentage?: number;
    grossEarned: Money;
    commissionEarned: Money;
  }[];
};

export type AgencyInvoice = {
  id: string;
  invoiceNumber: string;
  period?: string;
  issueDate: string;
  dueDate: string;
  amount: Money;
  grossRevenue?: Money;
  status: "PAID" | "PENDING" | "PROCESSING" | "OVERDUE";
  payoutDate?: string | null;
  wireReference?: string;
  downloadUrl: string;
};

export type AgencyPayoutAccount = {
  bankName: string;
  accountHolderName: string;
  accountNumberMasked: string;
  accountNumberLast4?: string;
  swiftBic: string;
  routingNumber?: string;
  iban?: string;
  currency: string;
  payoutSchedule: "MONTHLY_15TH" | "BI_WEEKLY";
  status?: "UNREGISTERED" | "PENDING_VERIFICATION" | "ACTIVE" | "REJECTED";
  verifiedAt?: string | null;
  pendingPayout?: Money;
  nextSettlementDate?: string;
};

export type UpdateAgencyPayoutAccountInput = {
  bank_name: string;
  account_holder_name: string;
  account_number?: string;
  swift_bic: string;
  routing_number?: string;
  iban?: string;
  currency?: string;
};

export type AgencyDisbursementItem = {
  id: string;
  settlementDate: string;
  amount: Money;
  wireReference: string;
  bankName: string;
  accountNumberMasked: string;
  period: string;
  status: "COMPLETED" | "PROCESSING";
};

export type CreatorSearchResult = {
  id: string;
  username: string;
  name: string;
  email: string;
  avatarUrl: string;
  category: string;
  relationshipStatus: "none" | "pending_consent" | "pending_admin" | "connected" | "unavailable";
  isInvitedByMe: boolean;
  canInvite: boolean;
};

export type AgencyReferralData = {
  referralCode: string;
  referralLink: string;
  totalReferred: number;
  qualifiedCount: number;
  commissionBonusPercentage: number;
};

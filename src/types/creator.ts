import type { ComplianceStatus, Money } from "./common";

export type CreatorDashboard = {
  liveHours: number;
  liveHoursTarget: number;
  contentProgress: number;
  complianceStatus: ComplianceStatus;
  availableEarnings: Money;
  pendingEarnings: Money;
  totalViewers: number;
  referralCode: string;
  referralLink: string;
  recentActivities: {
    id: string;
    title: string;
    timestamp: string;
    type: "stream" | "earning" | "compliance" | "referral";
  }[];
};

export type CreatorProfile = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  language: string;
  bio: string;
  avatarUrl: string;
  categories: string[];
  socialLinks: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  paymentMethod: {
    type: "PAYPAL" | "BANK_TRANSFER";
    accountHolder: string;
    details: string;
  };
  agreementSignedDate: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
};

export type CreatorPerformance = {
  totalHoursStreamed: number;
  totalStreamSessions: number;
  totalViewersCount: number;
  peakConcurrentViewers: number;
  avgWatchTimeMinutes: number;
  engagementRate: number;
  trendData: {
    date: string;
    hours: number;
    viewers: number;
    gifts: number;
  }[];
};

export type CreatorComplianceItem = {
  id: string;
  date: string;
  targetHours: number;
  achievedHours: number;
  status: ComplianceStatus;
  notes?: string;
};

export type CreatorCompliance = {
  overallStatus: ComplianceStatus;
  monthlyTargetHours: number;
  monthlyCompletedHours: number;
  compliancePercentage: number;
  dailyLogs: CreatorComplianceItem[];
  rulesChecklist: {
    id: string;
    title: string;
    description: string;
    isCompliant: boolean;
  }[];
};

export type CreatorReferralItem = {
  id: string;
  referredUser: string;
  avatarUrl: string;
  joinedDate: string;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  earningsGenerated: Money;
};

export type CreatorEarningsBreakdown = {
  totalEarnings: Money;
  availableForPayout: Money;
  pendingClearance: Money;
  sources: {
    category: "Live Stream Gifts" | "Direct Tips" | "Club Subscriptions" | "Referral Bonus";
    amount: Money;
    percentage: number;
  }[];
  history: {
    id: string;
    period: string;
    gifts: Money;
    tips: Money;
    subscriptions: Money;
    referralBonus: Money;
    total: Money;
  }[];
};

export type CreatorPayoutItem = {
  id: string;
  date: string;
  amount: Money;
  method: "PayPal" | "Bank Transfer";
  destination: string;
  status: "PAID" | "PROCESSING" | "FAILED" | "PENDING";
  transactionId: string;
};

export type CreatorAgencyContract = {
  agencyId: string;
  agencyName: string;
  agencyLogo?: string;
  managerName: string;
  managerEmail: string;
  contractStartDate: string;
  commissionSplitRate: number;
  status: "ACTIVE" | "PENDING_TRANSFER" | "TERMINATED";
};

export type CreatorMarketingKit = {
  id: string;
  title: string;
  category: "Banner" | "Stream Overlay" | "Social Badge" | "Promo Video";
  fileFormat: string;
  dimensions: string;
  fileSize: string;
  downloadUrl: string;
  previewUrl: string;
};

export type SupportTicket = {
  id: string;
  subject: string;
  category: "Technical" | "Payouts" | "Compliance" | "General";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
  updatedAt: string;
  messagesCount: number;
};

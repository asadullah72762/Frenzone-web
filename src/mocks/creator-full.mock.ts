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

export const creatorDashboardMock: CreatorDashboard = {
  liveHours: 42,
  liveHoursTarget: 60,
  contentProgress: 70,
  complianceStatus: "PARTIAL",
  availableEarnings: { amount: "3,480.00", currency: "USD" },
  pendingEarnings: { amount: "850.00", currency: "USD" },
  totalViewers: 124500,
  referralCode: "FRENC-ALEX88",
  referralLink: "https://frenzone.live/join/FRENC-ALEX88",
  recentActivities: [
    {
      id: "act-1",
      title: "Completed 4h Live Stream",
      timestamp: "2 hours ago",
      type: "stream",
    },
    {
      id: "act-2",
      title: "Received 1,200 Gifts in Stream",
      timestamp: "Yesterday",
      type: "earning",
    },
    {
      id: "act-3",
      title: "New Referred Creator Joined",
      timestamp: "2 days ago",
      type: "referral",
    },
    {
      id: "act-4",
      title: "Weekly Compliance Check Passed",
      timestamp: "3 days ago",
      type: "compliance",
    },
  ],
};

export const creatorProfileMock: CreatorProfile = {
  id: "cr-1092",
  username: "alex_vibe",
  fullName: "Alex Rivera",
  email: "alex.rivera@example.com",
  phone: "+1 (555) 382-9102",
  country: "United States",
  language: "English, Spanish",
  bio: "Full-time energetic music & gaming creator on Frenzone. Streaming daily live sessions, music production tutorials, and fan Q&As.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  categories: ["Music & Performance", "Gaming", "IRL & Lifestyle"],
  socialLinks: {
    instagram: "https://instagram.com/alex_vibe_official",
    tiktok: "https://tiktok.com/@alex_vibe",
    youtube: "https://youtube.com/c/AlexVibeLive",
  },
  paymentMethod: {
    type: "PAYPAL",
    accountHolder: "Alex Rivera",
    details: "alex.rivera.payouts@example.com",
  },
  agreementSignedDate: "2026-01-15",
  status: "ACTIVE",
};

export const creatorPerformanceMock: CreatorPerformance = {
  totalHoursStreamed: 148,
  totalStreamSessions: 32,
  totalViewersCount: 284500,
  peakConcurrentViewers: 4820,
  avgWatchTimeMinutes: 28.5,
  engagementRate: 8.4,
  trendData: [
    { date: "Aug 01", hours: 4.5, viewers: 3200, gifts: 450 },
    { date: "Aug 05", hours: 5.0, viewers: 3800, gifts: 620 },
    { date: "Aug 10", hours: 6.2, viewers: 4200, gifts: 780 },
    { date: "Aug 15", hours: 4.0, viewers: 3500, gifts: 510 },
    { date: "Aug 20", hours: 5.5, viewers: 4500, gifts: 890 },
    { date: "Aug 25", hours: 6.0, viewers: 4820, gifts: 940 },
    { date: "Aug 30", hours: 4.8, viewers: 4100, gifts: 720 },
  ],
};

export const creatorComplianceMock: CreatorCompliance = {
  overallStatus: "PARTIAL",
  monthlyTargetHours: 60,
  monthlyCompletedHours: 42,
  compliancePercentage: 70,
  dailyLogs: [
    { id: "log-1", date: "2026-08-30", targetHours: 2.0, achievedHours: 2.5, status: "COMPLETED" },
    { id: "log-2", date: "2026-08-29", targetHours: 2.0, achievedHours: 2.0, status: "COMPLETED" },
    { id: "log-3", date: "2026-08-28", targetHours: 2.0, achievedHours: 0.0, status: "MISSED", notes: "Excused for tech maintenance" },
    { id: "log-4", date: "2026-08-27", targetHours: 2.0, achievedHours: 1.5, status: "PARTIAL" },
    { id: "log-5", date: "2026-08-26", targetHours: 2.0, achievedHours: 3.0, status: "COMPLETED" },
  ],
  rulesChecklist: [
    { id: "rule-1", title: "Minimum 15 Live Stream Days / Month", description: "Stream for at least 1 hour on 15 separate calendar days.", isCompliant: true },
    { id: "rule-2", title: "High-Definition Video Quality (1080p)", description: "Maintain clear video bitrate above 4500 kbps.", isCompliant: true },
    { id: "rule-3", title: "No Copyright Violations", description: "Use licensed or royalty-free audio during live streams.", isCompliant: true },
    { id: "rule-4", title: "Community Policy Compliance", description: "Zero warnings or flags for safety violations.", isCompliant: true },
  ],
};

export const creatorReferralsMock: CreatorReferralItem[] = [
  {
    id: "ref-1",
    referredUser: "Elena Rostova (@elena_live)",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    joinedDate: "2026-08-12",
    status: "ACTIVE",
    earningsGenerated: { amount: "240.00", currency: "USD" },
  },
  {
    id: "ref-2",
    referredUser: "Marcus Chen (@marcus_beats)",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    joinedDate: "2026-08-04",
    status: "ACTIVE",
    earningsGenerated: { amount: "185.00", currency: "USD" },
  },
  {
    id: "ref-3",
    referredUser: "Sarah Jenkins (@sarah_j_games)",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    joinedDate: "2026-07-28",
    status: "PENDING",
    earningsGenerated: { amount: "0.00", currency: "USD" },
  },
];

export const creatorEarningsMock: CreatorEarningsBreakdown = {
  totalEarnings: { amount: "4,330.00", currency: "USD" },
  availableForPayout: { amount: "3,480.00", currency: "USD" },
  pendingClearance: { amount: "850.00", currency: "USD" },
  sources: [
    { category: "Live Stream Gifts", amount: { amount: "2,450.00", currency: "USD" }, percentage: 56.5 },
    { category: "Direct Tips", amount: { amount: "920.00", currency: "USD" }, percentage: 21.2 },
    { category: "Club Subscriptions", amount: { amount: "535.00", currency: "USD" }, percentage: 12.3 },
    { category: "Referral Bonus", amount: { amount: "425.00", currency: "USD" }, percentage: 10.0 },
  ],
  history: [
    {
      id: "earn-aug-26",
      period: "August 2026",
      gifts: { amount: "2,450.00", currency: "USD" },
      tips: { amount: "920.00", currency: "USD" },
      subscriptions: { amount: "535.00", currency: "USD" },
      referralBonus: { amount: "425.00", currency: "USD" },
      total: { amount: "4,330.00", currency: "USD" },
    },
    {
      id: "earn-jul-26",
      period: "July 2026",
      gifts: { amount: "2,100.00", currency: "USD" },
      tips: { amount: "780.00", currency: "USD" },
      subscriptions: { amount: "480.00", currency: "USD" },
      referralBonus: { amount: "310.00", currency: "USD" },
      total: { amount: "3,670.00", currency: "USD" },
    },
  ],
};

export const creatorPayoutsMock: CreatorPayoutItem[] = [
  {
    id: "po-8821",
    date: "2026-08-15",
    amount: { amount: "3,670.00", currency: "USD" },
    method: "PayPal",
    destination: "alex.rivera.payouts@example.com",
    status: "PAID",
    transactionId: "PP-TXN-994810294",
  },
  {
    id: "po-7740",
    date: "2026-07-15",
    amount: { amount: "2,980.00", currency: "USD" },
    method: "PayPal",
    destination: "alex.rivera.payouts@example.com",
    status: "PAID",
    transactionId: "PP-TXN-881920184",
  },
  {
    id: "po-6612",
    date: "2026-06-15",
    amount: { amount: "2,450.00", currency: "USD" },
    method: "Bank Transfer",
    destination: "Chase Bank (****4910)",
    status: "PAID",
    transactionId: "ACH-TXN-772910394",
  },
];

export const creatorAgencyContractMock: CreatorAgencyContract = {
  agencyId: "ag-4012",
  agencyName: "Apex Creator Network",
  managerName: "David Sterling",
  managerEmail: "david@apexcreators.com",
  contractStartDate: "2026-02-01",
  commissionSplitRate: 15,
  status: "ACTIVE",
};

export const creatorMarketingKitsMock: CreatorMarketingKit[] = [
  {
    id: "mk-1",
    title: "Official Frenzone Creator Badge Pack",
    category: "Social Badge",
    fileFormat: "PNG / SVG",
    dimensions: "1024x1024",
    fileSize: "4.2 MB",
    downloadUrl: "#",
    previewUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "mk-2",
    title: "1080p Stream Overlay Frame - Neon Dark",
    category: "Stream Overlay",
    fileFormat: "WEBM / PNG",
    dimensions: "1920x1080",
    fileSize: "18.5 MB",
    downloadUrl: "#",
    previewUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "mk-3",
    title: "Live Stream Countdown Intro Video",
    category: "Promo Video",
    fileFormat: "MP4",
    dimensions: "1920x1080",
    fileSize: "45.0 MB",
    downloadUrl: "#",
    previewUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop&q=80",
  },
];

export const creatorSupportTicketsMock: SupportTicket[] = [
  {
    id: "TICK-9041",
    subject: "PayPal Payout Clearance Time",
    category: "Payouts",
    status: "RESOLVED",
    priority: "MEDIUM",
    createdAt: "2026-08-16",
    updatedAt: "2026-08-17",
    messagesCount: 3,
  },
  {
    id: "TICK-8812",
    subject: "OBS Bitrate Drop During Peak Hours",
    category: "Technical",
    status: "CLOSED",
    priority: "LOW",
    createdAt: "2026-08-02",
    updatedAt: "2026-08-04",
    messagesCount: 5,
  },
];

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  CircleDollarSign,
  ClipboardCheck,
  FileText,
  HandCoins,
  Headphones,
  Link2,
  Megaphone,
  Radio,
  ReceiptText,
  Send,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";

export type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const creatorNavigation: NavigationItem[] = [
  { href: "/creator", label: "Overview", icon: BarChart3 },
  { href: "/creator/studio", label: "Live Studio", icon: Radio },
  { href: "/creator/application", label: "Application", icon: FileText },
  { href: "/creator/profile", label: "Profile", icon: UserRound },
  { href: "/creator/performance", label: "Performance", icon: BarChart3 },
  { href: "/creator/compliance", label: "Compliance", icon: ClipboardCheck },
  { href: "/creator/referrals", label: "Referrals", icon: Link2 },
  { href: "/creator/earnings", label: "Earnings", icon: CircleDollarSign },
  { href: "/creator/payouts", label: "Payouts", icon: WalletCards },
  { href: "/creator/agency", label: "Agency", icon: Building2 },
  { href: "/creator/marketing", label: "Marketing", icon: Megaphone },
  { href: "/creator/support", label: "Support", icon: Headphones },
];

export const agencyNavigation: NavigationItem[] = [
  { href: "/agency", label: "Overview", icon: BarChart3 },
  { href: "/agency/creators", label: "Creators", icon: Users },
  { href: "/agency/invitations", label: "Invitations", icon: Send },
  { href: "/agency/performance", label: "Performance", icon: BarChart3 },
  { href: "/agency/referrals", label: "Referrals", icon: Link2 },
  { href: "/agency/commissions", label: "Commissions", icon: HandCoins },
  { href: "/agency/invoices", label: "Invoices", icon: ReceiptText },
  { href: "/agency/payouts", label: "Payouts", icon: WalletCards },
  { href: "/agency/marketing", label: "Marketing", icon: Megaphone },
  { href: "/agency/support", label: "Support", icon: Headphones },
];

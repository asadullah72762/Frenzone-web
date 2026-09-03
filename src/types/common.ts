export type ApplicationStatus =
  | "PENDING_REVIEW"
  | "MORE_INFORMATION_REQUIRED"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";
export type ComplianceStatus = "COMPLETED" | "PARTIAL" | "MISSED" | "EXCUSED";
export type Money = { amount: string; currency: string };

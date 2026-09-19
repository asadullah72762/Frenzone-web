export type UserRole =
  | "ADMIN"
  | "ADMIN_STAFF"
  | "CREATOR"
  | "AGENCY_OWNER"
  | "AGENCY_MANAGER"
  | "AGENCY_FINANCE"
  | "USER";

export type AuthUser = {
  id: string;
  role: UserRole;
  displayName: string;
  email: string;
  creatorId?: string;
  agencyId?: string;
  isCreator?: boolean;
  isCreatorVerified?: boolean;
  isAgencyMember?: boolean;
  isAgencyVerified?: boolean;
  creatorStatus?: string;
  agencyStatus?: string;
  identityApprovalStatus?: string;
  identityVerified?: boolean;
  agencyMembership?: any;
  profilePicture?: string;
};
export type Session = { user: AuthUser; expiresAt: string };

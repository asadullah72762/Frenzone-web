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
  isAgencyMember?: boolean;
  creatorStatus?: string;
  agencyMembership?: any;
  profilePicture?: string;
};
export type Session = { user: AuthUser; expiresAt: string };

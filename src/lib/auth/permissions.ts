import type { UserRole } from "@/types/auth";
export function portalForRole(role: UserRole) {
  if (role === "CREATOR") return "/creator";
  if (["AGENCY_OWNER", "AGENCY_MANAGER", "AGENCY_FINANCE"].includes(role))
    return "/agency";
  return null;
}
export function canAccessPortal(role: UserRole, portal: "creator" | "agency") {
  return portal === "creator"
    ? role === "CREATOR"
    : ["AGENCY_OWNER", "AGENCY_MANAGER", "AGENCY_FINANCE"].includes(role);
}

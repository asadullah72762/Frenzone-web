import type { Session, UserRole } from "@/types/auth";

export type StaticLoginInput = {
  email: string;
  password: string;
  role: Extract<UserRole, "CREATOR" | "AGENCY_OWNER">;
};

export const authMockService = {
  async login(input: StaticLoginInput): Promise<Session> {
    return {
      user: {
        id: `static-${input.role.toLowerCase()}`,
        role: input.role,
        displayName: input.role === "CREATOR" ? "Demo Creator" : "Demo Agency",
        email: input.email,
      },
      expiresAt: "2099-01-01T00:00:00.000Z",
    };
  },
};

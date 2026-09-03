import { apiClient } from "@/lib/api/client";
import type {
  CreatorApplicationInput,
  ApplicationSubmissionResult,
} from "../../types/application";

export type ApplicationStatusResponse = {
  success: boolean;
  hasApplied: boolean;
  status: "none" | "pending" | "more_info_required" | "approved" | "rejected" | "suspended";
  application: any | null;
};

export const creatorApplicationService = {
  async submit(input: CreatorApplicationInput): Promise<ApplicationSubmissionResult> {
    const nameParts = (input.legalName || "").trim().split(" ");
    const firstname = nameParts[0] || "Creator";
    const lastname = nameParts.slice(1).join(" ") || "Applicant";

    // Transform frontend form payload to backend API contract
    const payload = {
      legal_name: {
        firstname,
        lastname,
      },
      contact_info: {
        email: input.email,
        phone: input.phone || "",
      },
      demographics: {
        country: input.country || "United States",
        language: input.language || "English",
        dob: "2000-01-01", // Default adult DOB fallback if not provided
      },
      content_profile: {
        category: (input.category || "other").toLowerCase(),
        primary_platform: "Instagram",
        social_links: {
          instagram: input.instagram || "",
          tiktok: input.tiktok || "",
          youtube: input.youtube || "",
        },
        estimated_audience_size: parseInt(input.audienceSize || "0", 10) || 0,
      },
      legal_agreements: {
        terms_accepted: Boolean(input.acceptTerms),
        privacy_accepted: Boolean(input.acceptPrivacy ?? input.acceptTerms),
      },
    };

    const response = await apiClient.post<{
      success: boolean;
      application: { _id: string; status: string };
    }>("/creator/application", payload);

    return {
      applicationId: response.application._id,
      status: response.application.status as any,
    };
  },

  async getStatus(): Promise<ApplicationStatusResponse> {
    return apiClient.get<ApplicationStatusResponse>("/creator/application/status");
  },
};

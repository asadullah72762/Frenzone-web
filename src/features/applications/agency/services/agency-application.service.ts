import { apiClient } from "@/lib/api/client";
import type {
  AgencyApplicationInput,
  ApplicationSubmissionResult,
} from "../../types/application";

export const agencyApplicationService = {
  async submit(input: AgencyApplicationInput): Promise<ApplicationSubmissionResult> {
    const payload = {
      agency_name: input.agencyName,
      country: input.country,
      business_address: input.businessAddress,
      registration_number: input.registrationNumber,
      tax_id: input.invoicingInformation || "",
      invoicing_information: input.invoicingInformation || "",
      website: input.website || "",
      social_links: input.socialLinks ? [input.socialLinks] : [],
      markets: input.markets
        ? input.markets.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      languages: input.languages
        ? input.languages.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      creator_categories: input.creatorCategories
        ? input.creatorCategories.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      creator_count: Number(input.creatorCount) || 0,
      supporting_documents: input.supportingDocuments || [],
      main_contact: {
        name: input.contactName,
        email: input.email,
        phone: input.phone || "",
      },
    };

    const response = await apiClient.post<{
      success: boolean;
      agency: { _id: string; status: string };
    }>("/agency/apply", payload);

    return {
      applicationId: response.agency._id,
      status: response.agency.status as any,
    };
  },
};

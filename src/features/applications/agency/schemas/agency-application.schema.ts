import { z } from "zod";

const requiredAgreement = z.boolean().refine(Boolean, "This agreement is required.");
export const agencyApplicationSchema = z.object({
  agencyName: z.string().trim().min(2, "Enter the legal agency name."),
  country: z.string().trim().min(2, "Select your country."),
  businessAddress: z.string().trim().min(5, "Enter the business address."),
  registrationNumber: z.string().trim().min(2, "Enter the registration or tax number."),
  website: z.string().trim().optional(),
  socialLinks: z.string().trim().optional(),
  contactName: z.string().trim().min(2, "Enter the main contact name."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().trim().min(6, "Enter a valid phone number."),
  markets: z.string().trim().min(2, "Enter your primary markets."),
  languages: z.string().trim().min(2, "Enter supported languages."),
  creatorCategories: z.string().trim().min(2, "Enter creator categories."),
  creatorCount: z.string().trim().min(1, "Enter the number of creators."),
  invoicingInformation: z.string().trim().min(2, "Enter invoicing information."),
  acceptTerms: requiredAgreement,
  acceptAgreement: requiredAgreement,
  supportingDocuments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
      })
    )
    .optional(),
});

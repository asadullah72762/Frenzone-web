import { z } from "zod";

const requiredAgreement = z.boolean().refine(Boolean, "This agreement is required.");
export const creatorApplicationSchema = z.object({
  legalName: z.string().trim().min(2, "Enter your legal name."),
  username: z.string().trim().min(2, "Enter your Frenzone username."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().trim().min(6, "Enter a valid phone number."),
  country: z.string().trim().min(2, "Select your country."),
  language: z.string().trim().min(2, "Enter your primary language."),
  dob: z
    .string()
    .trim()
    .min(1, "Enter your date of birth.")
    .refine((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) return false;
      const ageDiff = Date.now() - date.getTime();
      const age = Math.abs(new Date(ageDiff).getUTCFullYear() - 1970);
      return age >= 18;
    }, "You must be at least 18 years old to apply to the Creator Program."),
  isAdult: requiredAgreement,
  instagram: z.string().trim().optional(),
  tiktok: z.string().trim().optional(),
  youtube: z.string().trim().optional(),
  category: z.string().trim().min(2, "Select a creator category."),
  audienceSize: z.string().trim().min(1, "Select your audience size."),
  audienceCountry: z.string().trim().min(2, "Enter your primary audience country."),
  agencyStatus: z.string().trim().min(1, "Select your agency status."),
  acceptTerms: requiredAgreement,
  acceptPrivacy: requiredAgreement,
  acceptAgreement: requiredAgreement,
});

import type { ApplicationStatus } from "@/types/common";

export type ApplicationSubmissionResult = {
  applicationId: string;
  status: ApplicationStatus;
};

export type CreatorApplicationInput = {
  legalName: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  language: string;
  dob: string;
  isAdult: boolean;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  category: string;
  audienceSize: string;
  audienceCountry: string;
  agencyStatus: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptAgreement: boolean;
};

export type AgencyApplicationInput = {
  agencyName: string;
  country: string;
  businessAddress: string;
  registrationNumber: string;
  website?: string;
  socialLinks?: string;
  contactName: string;
  email: string;
  phone: string;
  markets: string;
  languages: string;
  creatorCategories: string;
  creatorCount: string;
  invoicingInformation: string;
  acceptTerms: boolean;
  acceptAgreement: boolean;
  supportingDocuments?: { name: string; url: string }[];
};

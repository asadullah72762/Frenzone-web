"use client";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, type InputHTMLAttributes, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { LogOut, LogIn, RefreshCw } from "lucide-react";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { SupportingDocumentUpload } from "./supporting-document-upload";
import type { AgencyApplicationInput } from "../../types/application";
import { agencyApplicationSchema } from "../schemas/agency-application.schema";
import { agencyApplicationService } from "../services/agency-application.service";
import { authService } from "@/features/auth/services/auth.service";

export function AgencyApplicationForm() {
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AgencyApplicationInput>({
    resolver: zodResolver(agencyApplicationSchema),
    defaultValues: { acceptTerms: false, acceptAgreement: false },
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const [documents, setDocuments] = useState<{ name: string; url: string }[]>([]);
  const [existingSession, setExistingSession] = useState<any>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("frenzone_token") || localStorage.getItem("token")
        : null;

    if (!token) {
      setIsAuthenticated(false);
      setIsLoadingSession(false);
      return;
    }

    setIsAuthenticated(true);
    authService
      .getSession()
      .then((session) => {
        setIsLoadingSession(false);
        if (session?.user) {
          setExistingSession(session.user);
          if (session.user.displayName) setValue("contactName", session.user.displayName);
          if (session.user.email) setValue("email", session.user.email);
        }
      })
      .catch(() => {
        setIsLoadingSession(false);
      });
  }, [setValue]);

  const submit = async (data: AgencyApplicationInput) => {
    setServerError(undefined);
    try {
      await agencyApplicationService.submit({
        ...data,
        supportingDocuments: documents,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setServerError(
        err.message || "Agency applications cannot be submitted at this time. Please try again.",
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-violet-50/50 via-surface to-pink-50/50 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand mb-4">
          <LogIn className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-text-primary">Sign In Required</h3>
        <p className="mt-2 text-sm text-text-secondary max-w-md mx-auto">
          Agency partnership applications connect directly to your verified Frenzone account. Please sign in or create an account to submit an application.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login?portal=AGENCY" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto" icon={<LogIn className="h-4 w-4" />}>
              Sign In to Apply
            </Button>
          </Link>
          <Link href="/signup?portal=AGENCY" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              Create an Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (existingSession?.isAgencyVerified || existingSession?.agencyMembership?.agency_id?.status === "approved") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-surface to-teal-50/30 p-8 shadow-sm space-y-4">
        <div className="flex items-center space-x-3">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            Agency Verified & Active
          </span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-text-primary">
            {existingSession?.agencyMembership?.agency_id?.agency_name || "Your Agency"} is Approved
          </h3>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            Your organization is an active, verified agency partner on Frenzone. You have access to the agency dashboard, creator talent roster, and commission settlements.
          </p>
        </div>
        <div className="pt-2 flex items-center space-x-3">
          <Link
            href="/agency"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand text-white font-bold text-sm hover:opacity-95 transition-all shadow-sm"
          >
            Open Agency Workspace →
          </Link>
        </div>
      </div>
    );
  }

  if (existingSession?.agencyStatus === "pending" || existingSession?.agencyMembership?.agency_id?.status === "pending") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-8 shadow-sm space-y-4">
        <div className="flex items-center space-x-3">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            Application Under Review
          </span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-text-primary">Your Agency Application is in Review</h3>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            Our compliance and platform management teams are verifying your business documents. You will be notified as soon as review completes.
          </p>
        </div>
        <div className="pt-2 flex items-center space-x-3">
          <Link
            href="/agency"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-surface border border-border text-text-primary font-bold text-sm hover:bg-surface-muted transition-all shadow-xs"
          >
            Check Agency Portal Status →
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 shadow-sm space-y-4">
        <div>
          <h3 className="text-xl font-bold">Agency Registration Complete!</h3>
          <p className="mt-1 text-sm text-emerald-800">
            Your Agency application has been submitted and your agency workspace has been provisioned.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/agency"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-brand text-white font-bold text-sm hover:opacity-95 transition-all shadow-sm"
          >
            Enter Agency Workspace →
          </Link>
        </div>
      </div>
    );
  }
  return (
    <form className="grid gap-8" onSubmit={handleSubmit(submit)} noValidate>
      <Section title="Agency information">
        <FormField
          id="agencyName"
          label="Legal agency name"
          error={errors.agencyName?.message}
          {...register("agencyName")}
        />
        <FormField
          id="country"
          label="Country"
          error={errors.country?.message}
          {...register("country")}
        />
        <FormField
          id="businessAddress"
          label="Business address"
          error={errors.businessAddress?.message}
          {...register("businessAddress")}
        />
        <FormField
          id="registrationNumber"
          label="Registration or tax number"
          error={errors.registrationNumber?.message}
          {...register("registrationNumber")}
        />
        <FormField
          id="website"
          label="Website (optional)"
          error={errors.website?.message}
          {...register("website")}
        />
        <FormField
          id="socialLinks"
          label="Social links (optional)"
          error={errors.socialLinks?.message}
          {...register("socialLinks")}
        />
      </Section>
      <SupportingDocumentUpload documents={documents} onChange={setDocuments} />
      <Section title="Contact and operations">
        <FormField
          id="contactName"
          label="Main contact"
          error={errors.contactName?.message}
          {...register("contactName")}
        />
        <FormField
          id="email"
          type="email"
          label="Email"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          id="phone"
          type="tel"
          label="Phone"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <FormField
          id="markets"
          label="Markets"
          error={errors.markets?.message}
          {...register("markets")}
        />
        <FormField
          id="languages"
          label="Languages"
          error={errors.languages?.message}
          {...register("languages")}
        />
        <FormField
          id="creatorCategories"
          label="Creator categories"
          error={errors.creatorCategories?.message}
          {...register("creatorCategories")}
        />
        <FormField
          id="creatorCount"
          label="Number of creators"
          error={errors.creatorCount?.message}
          {...register("creatorCount")}
        />
        <FormField
          id="invoicingInformation"
          label="Payment and invoicing information"
          error={errors.invoicingInformation?.message}
          {...register("invoicingInformation")}
        />
      </Section>
      <Agreement
        label="I accept the Agency Program Terms."
        error={errors.acceptTerms?.message}
        {...register("acceptTerms")}
      />
      <Agreement
        label="I accept the Agency Agreement."
        error={errors.acceptAgreement?.message}
        {...register("acceptAgreement")}
      />
      {serverError ? (
        <p className="text-danger rounded-md bg-red-50 p-3 text-sm" role="alert">
          {serverError}
        </p>
      ) : null}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Button disabled={isSubmitting} type="submit" variant="primary" className="w-full sm:w-auto">
          {isSubmitting ? "Submitting…" : "Submit application"}
        </Button>
      </div>
    </form>
  );
}
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="grid gap-4 border-t pt-6">
      <legend className="mb-4 text-lg font-semibold">{title}</legend>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </fieldset>
  );
}
function Agreement({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="flex gap-3 text-sm">
      <input className="mt-1 size-4" type="checkbox" {...props} />
      <span>
        {label}
        {error ? <span className="text-danger block text-xs">{error}</span> : null}
      </span>
    </label>
  );
}

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { SupportingDocumentUpload } from "./supporting-document-upload";
import type { AgencyApplicationInput } from "../../types/application";
import { agencyApplicationSchema } from "../schemas/agency-application.schema";
import { agencyApplicationService } from "../services/agency-application.service";
export function AgencyApplicationForm() {
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AgencyApplicationInput>({
    resolver: zodResolver(agencyApplicationSchema),
    defaultValues: { acceptTerms: false, acceptAgreement: false },
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const submit = async (data: AgencyApplicationInput) => {
    setServerError(undefined);
    try {
      await agencyApplicationService.submit(data);
      setIsSuccess(true);
    } catch (err: any) {
      setServerError(
        err.message || "Agency applications cannot be submitted at this time. Please try again.",
      );
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 shadow-sm">
        <h3 className="text-xl font-bold">Agency Application Submitted!</h3>
        <p className="mt-2 text-sm">
          Your Agency Application has been received and is currently under review by the Frenzone admin team.
        </p>
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
      <SupportingDocumentUpload />
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
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Submitting…" : "Submit application"}
      </Button>
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

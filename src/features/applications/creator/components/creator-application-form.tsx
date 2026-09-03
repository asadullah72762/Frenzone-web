"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import type { CreatorApplicationInput } from "../../types/application";
import { creatorApplicationSchema } from "../schemas/creator-application.schema";
import { creatorApplicationService } from "../services/creator-application.service";

export function CreatorApplicationForm() {
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatorApplicationInput>({
    resolver: zodResolver(creatorApplicationSchema),
    defaultValues: {
      isAdult: false,
      acceptTerms: false,
      acceptPrivacy: false,
      acceptAgreement: false,
    },
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const submit = async (data: CreatorApplicationInput) => {
    setServerError(undefined);
    try {
      await creatorApplicationService.submit(data);
      setIsSuccess(true);
    } catch (err: any) {
      setServerError(
        err.message || "Applications cannot be submitted at this time. Please try again.",
      );
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 shadow-sm">
        <h3 className="text-xl font-bold">Application Submitted Successfully!</h3>
        <p className="mt-2 text-sm">
          Your Creator Program Application has been received and is currently under review by the Frenzone team.
        </p>
      </div>
    );
  }
  return (
    <form className="grid gap-8" onSubmit={handleSubmit(submit)} noValidate>
      <FormSection title="Personal information">
        <FormField
          id="legalName"
          label="Full legal name"
          error={errors.legalName?.message}
          {...register("legalName")}
        />
        <FormField
          id="username"
          label="Frenzone username"
          error={errors.username?.message}
          {...register("username")}
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
          id="country"
          label="Country"
          error={errors.country?.message}
          {...register("country")}
        />
        <FormField
          id="language"
          label="Primary language"
          error={errors.language?.message}
          {...register("language")}
        />
      </FormSection>
      <FormSection title="Creator profile">
        <FormField
          id="category"
          label="Creator category"
          error={errors.category?.message}
          {...register("category")}
        />
        <FormField
          id="audienceSize"
          label="Audience size"
          error={errors.audienceSize?.message}
          {...register("audienceSize")}
        />
        <FormField
          id="audienceCountry"
          label="Primary audience country"
          error={errors.audienceCountry?.message}
          {...register("audienceCountry")}
        />
        <FormField
          id="agencyStatus"
          label="Agency status"
          error={errors.agencyStatus?.message}
          {...register("agencyStatus")}
        />
        <FormField
          id="instagram"
          label="Instagram (optional)"
          error={errors.instagram?.message}
          {...register("instagram")}
        />
        <FormField
          id="tiktok"
          label="TikTok (optional)"
          error={errors.tiktok?.message}
          {...register("tiktok")}
        />
        <FormField
          id="youtube"
          label="YouTube (optional)"
          error={errors.youtube?.message}
          {...register("youtube")}
        />
      </FormSection>
      <Agreement
        label="I confirm that I am at least 18 years old."
        error={errors.isAdult?.message}
        {...register("isAdult")}
      />
      <Agreement
        label="I accept the Creator Program Terms."
        error={errors.acceptTerms?.message}
        {...register("acceptTerms")}
      />
      <Agreement
        label="I accept the Privacy Notice."
        error={errors.acceptPrivacy?.message}
        {...register("acceptPrivacy")}
      />
      <Agreement
        label="I accept the Creator Agreement."
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
function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
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

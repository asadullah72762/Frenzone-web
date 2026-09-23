"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  LogIn,
  Award,
  Info,
} from "lucide-react";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import type { CreatorApplicationInput } from "../../types/application";
import { creatorApplicationSchema } from "../schemas/creator-application.schema";
import {
  creatorApplicationService,
  type ApplicationStatusResponse,
} from "../services/creator-application.service";
import { authService } from "@/features/auth/services/auth.service";

export function CreatorApplicationForm() {
  const [serverError, setServerError] = useState<string>();
  const [statusData, setStatusData] = useState<ApplicationStatusResponse | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isRefreshing, startRefresh] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatorApplicationInput>({
    resolver: zodResolver(creatorApplicationSchema),
    defaultValues: {
      isAdult: false,
      acceptTerms: false,
      acceptPrivacy: false,
      acceptAgreement: false,
      dob: "",
      country: "United States",
      language: "English",
      category: "lifestyle",
      audienceSize: "1000",
      agencyStatus: "independent",
    },
  });

  const [isAdult, acceptTerms, acceptPrivacy, acceptAgreement] = watch([
    "isAdult",
    "acceptTerms",
    "acceptPrivacy",
    "acceptAgreement",
  ]);
  const allAgreementsChecked = Boolean(isAdult && acceptTerms && acceptPrivacy && acceptAgreement);

  const checkStatus = async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("frenzone_token") || localStorage.getItem("token")
        : null;

    if (!token) {
      setIsAuthenticated(false);
      setIsLoadingStatus(false);
      return;
    }

    setIsAuthenticated(true);
    try {
      const [res, session] = await Promise.all([
        creatorApplicationService.getStatus().catch(() => null),
        authService.getSession().catch(() => null),
      ]);

      const isVerifiedUser = Boolean(
        session?.user?.isCreatorVerified ||
        session?.user?.isCreator ||
        session?.user?.creatorStatus === "approved" ||
        res?.status === "approved"
      );

      if (isVerifiedUser) {
        setStatusData({
          hasApplied: true,
          status: "approved",
          complianceStatus: "approved",
          liveAccess: true,
          application: res?.application || null,
        } as any);
      } else {
        setStatusData(res);
      }

      // Pre-fill user details if application exists or from cached user
      if (res?.application) {
        const app = res.application;
        if (app.legal_name) {
          setValue(
            "legalName",
            `${app.legal_name.firstname || ""} ${app.legal_name.lastname || ""}`.trim()
          );
        }
        if (app.contact_info?.email) setValue("email", app.contact_info.email);
        if (app.contact_info?.phone) setValue("phone", app.contact_info.phone);
        if (app.demographics?.dob) {
          const dobValue =
            typeof app.demographics.dob === "string"
              ? app.demographics.dob.split("T")[0]
              : new Date(app.demographics.dob).toISOString().split("T")[0];
          setValue("dob", dobValue);
        }
        if (app.demographics?.country) setValue("country", app.demographics.country);
        if (app.demographics?.language) setValue("language", app.demographics.language);
        if (app.content_profile?.category) setValue("category", app.content_profile.category);
        if (app.content_profile?.social_links?.instagram) {
          setValue("instagram", app.content_profile.social_links.instagram);
        }
        if (app.content_profile?.social_links?.tiktok) {
          setValue("tiktok", app.content_profile.social_links.tiktok);
        }
        if (app.content_profile?.social_links?.youtube) {
          setValue("youtube", app.content_profile.social_links.youtube);
        }
      } else {
        // Pre-fill from local user storage if available
        const localUserStr = localStorage.getItem("user");
        if (localUserStr) {
          try {
            const user = JSON.parse(localUserStr);
            if (user.email) setValue("email", user.email);
            if (user.username) setValue("username", user.username);
            if (user.firstname || user.lastname) {
              setValue("legalName", `${user.firstname || ""} ${user.lastname || ""}`.trim());
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    } catch {
      // If error occurs (e.g. 401 unauthenticated), set status to none
      setStatusData(null);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleRefresh = () => {
    startRefresh(async () => {
      await checkStatus();
    });
  };

  const submit = async (data: CreatorApplicationInput) => {
    setServerError(undefined);
    try {
      await creatorApplicationService.submit(data);
      await checkStatus();
    } catch (err: any) {
      setServerError(
        err.message || "Applications cannot be submitted at this time. Please try again."
      );
    }
  };

  // ── 1. LOADING STATE ──
  if (isLoadingStatus) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-brand" />
        <p className="text-sm font-semibold text-text-secondary">
          Checking your Creator Program application status...
        </p>
      </div>
    );
  }

  // ── 2. UNAUTHENTICATED STATE ──
  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-violet-50/50 via-surface to-pink-50/50 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand mb-4">
          <LogIn className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-text-primary">Sign In Required</h3>
        <p className="mt-2 text-sm text-text-secondary max-w-md mx-auto">
          The Creator Program connects directly to your canonical Frenzone user account. Please sign in or create an account to start your application.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto" icon={<LogIn className="h-4 w-4" />}>
              Sign In to Apply
            </Button>
          </Link>
          <Link href="/signup" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              Create an Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ── 3. APPROVED STATE ──
  if (statusData?.status === "approved") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-surface to-teal-50/30 p-8 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Award className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                Application Approved
              </span>
            </div>
            <h3 className="text-2xl font-bold text-text-primary">
              Welcome to the Frenzone Creator Program!
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Your application has been approved by the Frenzone team. You now have full access to live streaming features, creator earnings, analytics, and your personalized creator dashboard.
            </p>
            <div className="pt-4 flex items-center space-x-3">
              <Link href="/creator">
                <Button variant="primary" icon={<ArrowRight className="h-4 w-4" />}>
                  Go to Creator Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 4. PENDING REVIEW STATE ──
  if (statusData?.status === "pending") {
    const app = statusData.application;
    const submittedDate = app?.createdAt
      ? new Date(app.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Recently";

    return (
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/60 via-surface to-amber-50/20 p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Clock className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                  Pending Review
                </span>
                <span className="text-xs text-text-muted">Submitted on {submittedDate}</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary">
                Your Application is Under Review
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
                Thank you for applying to the Frenzone Creator Program. Our team is carefully reviewing your content profile and identity. We typically complete reviews within 24 to 48 hours.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface-muted transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Check Status</span>
          </button>
        </div>

        {app ? (
          <div className="mt-6 rounded-xl border border-border bg-surface/80 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="font-semibold text-text-muted">Applicant Name</p>
              <p className="font-bold text-text-primary mt-0.5">
                {app.legal_name?.firstname} {app.legal_name?.lastname}
              </p>
            </div>
            <div>
              <p className="font-semibold text-text-muted">Content Category</p>
              <p className="font-bold text-text-primary mt-0.5 capitalize">
                {app.content_profile?.category || "Creator"}
              </p>
            </div>
            <div>
              <p className="font-semibold text-text-muted">Target Platform</p>
              <p className="font-bold text-text-primary mt-0.5">
                {app.content_profile?.primary_platform || "Instagram / Live"}
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-6 pt-4 border-t border-amber-200/60 text-xs text-text-secondary">
          <p>
            Your application is currently being evaluated by our compliance team. Once approved, your live streaming studio and creator hub will automatically unlock.
          </p>
        </div>
      </div>
    );
  }

  // ── 5. REJECTED STATE ──
  if (statusData?.status === "rejected") {
    const app = statusData.application;
    const reviewNotes = app?.admin_review?.more_info_requested_message || app?.admin_review?.review_notes;

    return (
      <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 via-surface to-pink-50/30 p-8 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-700">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-800">
                Application Not Approved
              </span>
            </div>
            <h3 className="text-xl font-bold text-text-primary">
              Application Decision Notice
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              We appreciate your interest in the Frenzone Creator Program. After review, your application does not currently meet our program criteria.
            </p>

            {reviewNotes ? (
              <div className="rounded-xl border border-red-200 bg-surface p-4 text-xs">
                <p className="font-bold text-red-900">Reviewer Feedback:</p>
                <p className="text-text-secondary mt-1">{reviewNotes}</p>
              </div>
            ) : null}

            <div className="rounded-xl bg-surface p-4 text-xs text-text-secondary space-y-1.5 border border-border">
              <p className="font-bold text-text-primary">Re-application Guidelines:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Build an active following on supported platforms (Instagram, TikTok, YouTube).</li>
                <li>Ensure all identity and contact information is verified and accurate.</li>
                <li>You may submit a revised application in 30 days.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 6. APPLICATION FORM (New submission or More Info Required) ──
  return (
    <div className="space-y-6">
      {statusData?.status === "more_info_required" ? (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-900 flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-bold">Additional Information Requested</p>
            <p>
              {statusData.application?.admin_review?.more_info_requested_message ||
                "Please review and update the information requested by our review team below, then resubmit your application."}
            </p>
          </div>
        </div>
      ) : null}

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
            label="Email address"
            error={errors.email?.message}
            {...register("email")}
          />
          <FormField
            id="phone"
            type="tel"
            label="Phone number"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <FormField
            id="dob"
            type="date"
            label="Date of birth"
            error={errors.dob?.message}
            {...register("dob")}
          />
          <FormField
            id="country"
            label="Country of residence"
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
          <div className="space-y-1.5 text-sm">
            <label htmlFor="category" className="block text-xs font-semibold text-text-primary">
              Content category
            </label>
            <select
              id="category"
              {...register("category")}
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text-primary shadow-xs transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            >
              <option value="lifestyle">Lifestyle & Vlogging</option>
              <option value="gaming">Gaming & Esports</option>
              <option value="music">Music & Performance</option>
              <option value="fitness">Fitness & Health</option>
              <option value="art">Art & Creative</option>
              <option value="education">Education & Tech</option>
              <option value="other">Other Entertainment</option>
            </select>
            {errors.category?.message ? (
              <p className="text-xs text-red-500">{errors.category.message}</p>
            ) : null}
          </div>
          <FormField
            id="audienceSize"
            label="Estimated audience size"
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
            label="Agency status (e.g. Independent or Agency Affiliated)"
            error={errors.agencyStatus?.message}
            {...register("agencyStatus")}
          />
          <FormField
            id="instagram"
            label="Instagram handle/link (optional)"
            error={errors.instagram?.message}
            {...register("instagram")}
          />
          <FormField
            id="tiktok"
            label="TikTok handle/link (optional)"
            error={errors.tiktok?.message}
            {...register("tiktok")}
          />
          <FormField
            id="youtube"
            label="YouTube channel link (optional)"
            error={errors.youtube?.message}
            {...register("youtube")}
          />
        </FormSection>

        <div className="space-y-3 border-t border-border pt-6">
          <Agreement
            label="I confirm that I am at least 18 years of age."
            error={errors.isAdult?.message}
            {...register("isAdult")}
          />
          <Agreement
            label="I accept the Frenzone Creator Program Terms."
            error={errors.acceptTerms?.message}
            {...register("acceptTerms")}
          />
          <Agreement
            label="I accept the Frenzone Privacy Policy."
            error={errors.acceptPrivacy?.message}
            {...register("acceptPrivacy")}
          />
          <Agreement
            label="I accept the Creator Conduct and Streaming Agreement."
            error={errors.acceptAgreement?.message}
            {...register("acceptAgreement")}
          />
        </div>

        {serverError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-danger font-semibold flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-danger" />
            <span>{serverError}</span>
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            disabled={isSubmitting || !allAgreementsChecked}
            type="submit"
            variant="primary"
            className="w-full sm:w-auto"
            isLoading={isSubmitting}
            icon={<CheckCircle2 className="h-4 w-4" />}
          >
            {isSubmitting ? "Submitting Application…" : "Submit Creator Application"}
          </Button>
          {!allAgreementsChecked && (
            <span className="text-xs text-text-muted">
              Please check all 4 confirmations above to enable submission.
            </span>
          )}
        </div>
      </form>
    </div>
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
    <fieldset className="grid gap-4 border-t border-border pt-6">
      <legend className="mb-4 text-lg font-bold text-text-primary">{title}</legend>
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
    <label className="flex items-start gap-3 text-sm cursor-pointer select-none">
      <input
        className="mt-1 size-4 rounded border-border text-brand focus:ring-brand accent-brand cursor-pointer"
        type="checkbox"
        {...props}
      />
      <span className="text-text-secondary leading-snug">
        {label}
        {error ? <span className="text-danger block text-xs font-semibold mt-0.5">{error}</span> : null}
      </span>
    </label>
  );
}

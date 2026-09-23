"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UserPlus, Eye, EyeOff, CheckCircle2, Gift, Video, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/google-icon";
import { authService, type SignupInput } from "@/features/auth/services/auth.service";
import { referralService } from "@/features/referrals/services/referral.service";

export function SignupForm() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"CREATOR" | "AGENCY">("CREATOR");
  const [agencyName, setAgencyName] = useState("");
  const [formData, setFormData] = useState<SignupInput>({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    referralCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>();
  const [successMsg, setSuccessMsg] = useState<string>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref") || params.get("referralCode") || params.get("code");
      if (ref) {
        setFormData((prev) => ({ ...prev, referralCode: ref }));
        referralService.trackScan(ref).catch(() => {});
      }
      const portal = params.get("portal") || params.get("type");
      if (portal?.toUpperCase() === "AGENCY") {
        setAccountType("AGENCY");
      }
    }
  }, []);

  const handleGoogleSignUp = async () => {
    if (accountType === "AGENCY" && !agencyName.trim()) {
      setErrorMsg("Please enter your agency or company name before signing up with Google.");
      return;
    }
    setIsGoogleSubmitting(true);
    setErrorMsg(undefined);
    setSuccessMsg(undefined);

    try {
      const res = await authService.loginWithGoogle(
        accountType,
        accountType === "AGENCY" ? agencyName.trim() : undefined,
        formData.referralCode
      );

      if (res.error) {
        setErrorMsg(res.error);
        return;
      }

      setSuccessMsg(
        accountType === "AGENCY"
          ? "Agency account registered successfully! Redirecting to Agency Portal..."
          : "Account registered successfully! Redirecting to workspace..."
      );

      setTimeout(() => {
        router.push(accountType === "AGENCY" ? "/agency" : "/creator");
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Google registration failed. Please try again.");
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleChange = (field: keyof SignupInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(undefined);
    setSuccessMsg(undefined);

    if (accountType === "AGENCY" && !agencyName.trim()) {
      setErrorMsg("Please enter your agency or company name.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await authService.signup({
        ...formData,
        accountType,
        agencyName: accountType === "AGENCY" ? agencyName.trim() : undefined,
      });
      if (res.error) {
        setErrorMsg(res.error);
        return;
      }
      setSuccessMsg(
        accountType === "AGENCY"
          ? "Agency account registered successfully! Redirecting to Agency Portal..."
          : "Account registered successfully! Redirecting to workspace..."
      );
      setTimeout(() => {
        router.push(accountType === "AGENCY" ? "/agency" : "/creator");
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Account Type Selector */}
      <div className="grid grid-cols-2 p-1 bg-surface-muted rounded-xl border border-border">
        <button
          type="button"
          onClick={() => setAccountType("CREATOR")}
          className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            accountType === "CREATOR"
              ? "bg-brand text-white shadow-xs font-bold"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          <Video className={`h-3.5 w-3.5 ${accountType === "CREATOR" ? "text-white" : "text-brand"}`} />
          <span>Creator</span>
        </button>
        <button
          type="button"
          onClick={() => setAccountType("AGENCY")}
          className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            accountType === "AGENCY"
              ? "bg-brand text-white shadow-xs font-bold"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          <Building2 className={`h-3.5 w-3.5 ${accountType === "AGENCY" ? "text-white" : "text-brand"}`} />
          <span>Agency</span>
        </button>
      </div>

      {accountType === "AGENCY" && (
        <div>
          <label className="text-xs font-medium text-text-secondary block mb-1">
            Agency Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            required
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-xs text-text-primary outline-none focus:border-brand transition-colors"
            placeholder="e.g. Apex Talent Management"
          />
        </div>
      )}

      {errorMsg ? (
        <div className="rounded-lg bg-red-50 p-3 border border-red-200 text-xs text-danger font-medium">
          {errorMsg}
        </div>
      ) : null}

      {successMsg ? (
        <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      ) : null}

      {formData.referralCode ? (
        <div className="rounded-lg bg-brand-soft/40 px-3 py-2 border border-brand/20 text-xs text-brand font-medium flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Gift className="h-3.5 w-3.5 text-brand" />
            <span>Referral: <strong className="font-mono">{formData.referralCode}</strong></span>
          </div>
          <span className="text-[10px] bg-brand text-white px-1.5 py-0.5 rounded-full font-bold">10% BONUS</span>
        </div>
      ) : null}

      {/* Google Authentication Button */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isGoogleSubmitting || isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border bg-surface hover:bg-surface-muted active:scale-[0.99] text-xs font-semibold text-text-primary transition-all shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isGoogleSubmitting ? (
          <div className="h-4 w-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        ) : (
          <GoogleIcon className="h-4 w-4 shrink-0" />
        )}
        <span>{isGoogleSubmitting ? "Connecting..." : "Continue with Google"}</span>
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-border w-full" />
        <span className="bg-surface px-2.5 text-[11px] font-medium text-text-muted absolute">
          or
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1">First Name</label>
            <input
              type="text"
              required
              value={formData.firstname}
              onChange={(e) => handleChange("firstname", e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-xs text-text-primary outline-none focus:border-brand transition-colors"
              placeholder="First"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1">Last Name</label>
            <input
              type="text"
              required
              value={formData.lastname}
              onChange={(e) => handleChange("lastname", e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-xs text-text-primary outline-none focus:border-brand transition-colors"
              placeholder="Last"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary block mb-1">Username</label>
          <input
            type="text"
            required
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-xs text-text-primary outline-none focus:border-brand transition-colors"
            placeholder="username"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary block mb-1">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-xs text-text-primary outline-none focus:border-brand transition-colors"
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary block mb-1">Password</label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-2 pr-10 text-xs text-text-primary outline-none focus:border-brand transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPassword((prev) => !prev);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-3.5 w-3.5 text-brand" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full text-xs"
          isLoading={isSubmitting}
          icon={<UserPlus className="h-3.5 w-3.5" />}
        >
          Create account
        </Button>
      </form>

      <div className="text-center">
        <p className="text-xs text-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-brand font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

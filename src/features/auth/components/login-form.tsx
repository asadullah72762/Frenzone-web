"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LogIn, Eye, EyeOff, ShieldCheck, Video, Building2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/google-icon";
import { authService } from "@/features/auth/services/auth.service";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [targetPortal, setTargetPortal] = useState<"CREATOR" | "AGENCY">("CREATOR");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState<"CREATOR" | "AGENCY" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>();

  const handleDemoQuickSwitch = async (role: "CREATOR" | "AGENCY") => {
    setIsDemoSubmitting(role);
    setErrorMsg(undefined);

    try {
      const res = await authService.loginDemo(role);
      if (res.error) {
        setErrorMsg(res.error);
        return;
      }

      if (role === "CREATOR") {
        router.push("/creator");
      } else {
        router.push("/agency");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to initialize demo session.");
    } finally {
      setIsDemoSubmitting(null);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const portal = params.get("portal");
      if (portal && portal.toUpperCase() === "AGENCY") {
        setTargetPortal("AGENCY");
      }
    }
  }, []);

  const handlePortalRedirect = (user: any) => {
    if (targetPortal === "AGENCY") {
      if (user.isAgencyMember || user.isAgencyVerified || user.role?.startsWith("AGENCY_") || user.agencyStatus === "approved") {
        router.push("/agency");
      } else {
        // User intended to log in to Agency portal but hasn't created their agency yet.
        router.push("/agency-apply");
      }
    } else {
      // Target is CREATOR
      if ((user.isAgencyMember || user.isAgencyVerified) && !user.isCreator && !user.isCreatorVerified && user.creatorStatus !== "approved") {
        setErrorMsg("Access denied. Your account is registered strictly as an Agency. Please select the Agency Portal.");
        return;
      }
      if (user.isCreator || user.isCreatorVerified || user.creatorStatus === "approved" || user.creatorStatus === "pending") {
        router.push("/creator");
      } else {
        // Standard registered user: route to Creator apply page to initiate onboarding
        router.push("/creator-apply");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    setErrorMsg(undefined);

    try {
      const res = await authService.loginWithGoogle(targetPortal);
      if (res.error) {
        setErrorMsg(res.error);
        return;
      }

      const session = await authService.getSession();
      handlePortalRedirect(session.user);
    } catch (err: any) {
      setErrorMsg(err.message || "Google sign-in failed. Please try again.");
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(undefined);

    try {
      // 100% Backend Authoritative Authentication API Call
      const res = await authService.login({
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.error) {
        setErrorMsg(res.error);
        return;
      }

      // Authoritative Role Resolution from backend session
      const session = await authService.getSession();
      handlePortalRedirect(session.user);
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Workspace Type Selector */}
      <div className="grid grid-cols-2 p-1 bg-surface-muted rounded-xl border border-border">
        <button
          type="button"
          onClick={() => setTargetPortal("CREATOR")}
          className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            targetPortal === "CREATOR"
              ? "bg-surface text-text-primary shadow-xs font-bold"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          <Video className="h-3.5 w-3.5 text-brand" />
          <span>Creator</span>
        </button>
        <button
          type="button"
          onClick={() => setTargetPortal("AGENCY")}
          className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            targetPortal === "AGENCY"
              ? "bg-surface text-text-primary shadow-xs font-bold"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          <Building2 className="h-3.5 w-3.5 text-brand" />
          <span>Agency</span>
        </button>
      </div>

      {errorMsg ? (
        <div className="rounded-lg bg-red-50 p-3 border border-red-200 text-xs text-danger font-medium">
          {errorMsg}
        </div>
      ) : null}

      {/* Google Sign-In */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
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

      {/* Email / Password Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="text-xs font-medium text-text-secondary block mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          icon={<LogIn className="h-3.5 w-3.5" />}
        >
          Sign in
        </Button>
      </form>

      {/* Compact Demo Quick-Switch */}
      <div className="pt-3 border-t border-border">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-[11px] font-medium text-text-secondary">
            <Zap className="h-3 w-3 text-brand" />
            Quick demo:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleDemoQuickSwitch("CREATOR")}
              disabled={isDemoSubmitting !== null || isSubmitting || isGoogleSubmitting}
              className="px-2.5 py-1 rounded-md bg-surface-muted hover:bg-brand-soft/60 text-[11px] font-medium text-text-primary hover:text-brand border border-border transition-colors cursor-pointer disabled:opacity-50"
            >
              {isDemoSubmitting === "CREATOR" ? "Loading..." : "Creator"}
            </button>
            <button
              type="button"
              onClick={() => handleDemoQuickSwitch("AGENCY")}
              disabled={isDemoSubmitting !== null || isSubmitting || isGoogleSubmitting}
              className="px-2.5 py-1 rounded-md bg-surface-muted hover:bg-brand-soft/60 text-[11px] font-medium text-text-primary hover:text-brand border border-border transition-colors cursor-pointer disabled:opacity-50"
            >
              {isDemoSubmitting === "AGENCY" ? "Loading..." : "Agency"}
            </button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

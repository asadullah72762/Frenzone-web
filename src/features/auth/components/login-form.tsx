"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Video, Building2 } from "lucide-react";
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
      {/* Workspace type — kept functional (routes agency sign-ins correctly), shown as a compact pill row */}
      <div className="inline-flex items-center gap-1 rounded-full border border-border p-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => setTargetPortal("CREATOR")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors cursor-pointer ${
            targetPortal === "CREATOR" ? "bg-brand text-white shadow-xs" : "text-text-muted hover:text-text-primary"
          }`}
        >
          <Video className="h-3.5 w-3.5" /> Creator
        </button>
        <button
          type="button"
          onClick={() => setTargetPortal("AGENCY")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors cursor-pointer ${
            targetPortal === "AGENCY" ? "bg-brand text-white shadow-xs" : "text-text-muted hover:text-text-primary"
          }`}
        >
          <Building2 className="h-3.5 w-3.5" /> Agency
        </button>
      </div>

      {errorMsg ? (
        <div className="rounded-xl bg-danger-soft p-3 border border-danger/20 text-sm text-danger font-medium">
          {errorMsg}
        </div>
      ) : null}

      {/* Google Sign-In */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleSubmitting || isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border border-border bg-surface hover:bg-surface-muted text-sm font-bold text-text-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isGoogleSubmitting ? (
          <div className="h-4 w-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        ) : (
          <GoogleIcon className="h-4 w-4 shrink-0" />
        )}
        <span>{isGoogleSubmitting ? "Connecting…" : "Continue with Google"}</span>
      </button>

      {/* Apple sign-in is not wired to a backend provider yet — shown to match the brand's reference
          design, but kept disabled rather than faking a working flow. */}
      <button
        type="button"
        disabled
        title="Apple sign-in is not available yet"
        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border border-border bg-surface text-sm font-bold text-text-primary/40 cursor-not-allowed"
      >
        <span></span>
        <span>Continue with Apple</span>
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center py-1">
        <div className="border-t border-border w-full" />
        <span className="bg-surface px-3 text-xs font-medium text-text-muted absolute">or use email and password</span>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-bold text-text-primary block mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none focus:border-brand transition-colors"
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-text-primary block mb-1.5">Password</label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 pr-11 text-sm text-text-primary outline-none focus:border-brand transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPassword((prev) => !prev);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-brand py-3.5 text-base font-bold text-white shadow-sm hover:bg-brand-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-center text-sm text-text-muted">No separate portal username is created.</p>
      </form>

      {/* Demo quick-switch kept available, low-key */}
      <div className="pt-4 border-t border-border flex items-center justify-between gap-2 text-xs font-semibold text-text-muted">
        <span>Quick demo:</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleDemoQuickSwitch("CREATOR")}
            disabled={isDemoSubmitting !== null || isSubmitting || isGoogleSubmitting}
            className="text-brand hover:underline disabled:opacity-50"
          >
            {isDemoSubmitting === "CREATOR" ? "Loading…" : "Creator"}
          </button>
          <button
            type="button"
            onClick={() => handleDemoQuickSwitch("AGENCY")}
            disabled={isDemoSubmitting !== null || isSubmitting || isGoogleSubmitting}
            className="text-brand hover:underline disabled:opacity-50"
          >
            {isDemoSubmitting === "AGENCY" ? "Loading…" : "Agency"}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-brand font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

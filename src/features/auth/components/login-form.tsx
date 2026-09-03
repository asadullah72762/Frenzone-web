"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogIn, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/features/auth/services/auth.service";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"CREATOR" | "AGENCY_OWNER">("CREATOR");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>();

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

      // Route based on user selection / backend role
      if (role === "CREATOR") {
        router.push("/creator");
      } else {
        router.push("/agency");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Real API Security Notice */}
      <div className="rounded-xl border border-brand/20 bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50 p-3.5 flex items-center space-x-3">
        <ShieldCheck className="h-5 w-5 text-brand shrink-0" />
        <p className="text-xs font-semibold text-text-secondary">
          Enter your registered Frenzone email and password to authenticate directly with the Node.js backend server.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg ? (
          <div className="rounded-lg bg-red-50 p-3.5 border border-red-200 text-xs text-danger font-semibold">
            {errorMsg}
          </div>
        ) : null}

        <div>
          <label className="text-xs font-semibold text-text-secondary">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-text-primary outline-none focus:border-brand"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text-secondary">Password</label>
          <div className="relative mt-1 flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-2 pr-10 text-sm text-text-primary outline-none focus:border-brand"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPassword((prev) => !prev);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer p-1.5 z-10 flex items-center justify-center"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-brand" />
              ) : (
                <Eye className="h-4 w-4 text-text-muted hover:text-text-primary" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-text-secondary">Target Workspace Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full mt-1 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-medium text-text-primary outline-none focus:border-brand cursor-pointer"
          >
            <option value="CREATOR">Creator Portal (/creator)</option>
            <option value="AGENCY_OWNER">Agency Portal (/agency)</option>
          </select>
        </div>

        <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting} icon={<LogIn className="h-4 w-4" />}>
          Sign In to Workspace
        </Button>

        <div className="text-center pt-2">
          <p className="text-xs text-text-muted">
            Don't have an account yet?{" "}
            <Link href="/signup" className="text-brand font-bold hover:underline">
              Create a Frenzone Account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

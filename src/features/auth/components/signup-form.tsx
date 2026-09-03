"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserPlus, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService, type SignupInput } from "@/features/auth/services/auth.service";

export function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupInput>({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>();
  const [successMsg, setSuccessMsg] = useState<string>();

  const handleChange = (field: keyof SignupInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(undefined);
    setSuccessMsg(undefined);

    try {
      const res = await authService.signup(formData);
      if (res.error) {
        setErrorMsg(res.error);
        return;
      }
      setSuccessMsg("Account registered successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg ? (
        <div className="rounded-lg bg-red-50 p-3 border border-red-200 text-xs text-danger font-medium">
          {errorMsg}
        </div>
      ) : null}

      {successMsg ? (
        <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-text-secondary">First Name</label>
          <input
            type="text"
            required
            value={formData.firstname}
            onChange={(e) => handleChange("firstname", e.target.value)}
            className="w-full mt-1 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-text-primary outline-none focus:border-brand"
            placeholder="John"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text-secondary">Last Name</label>
          <input
            type="text"
            required
            value={formData.lastname}
            onChange={(e) => handleChange("lastname", e.target.value)}
            className="w-full mt-1 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-text-primary outline-none focus:border-brand"
            placeholder="Doe"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-text-secondary">Username</label>
        <input
          type="text"
          required
          value={formData.username}
          onChange={(e) => handleChange("username", e.target.value)}
          className="w-full mt-1 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-text-primary outline-none focus:border-brand"
          placeholder="johndoe_creator"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-text-secondary">Email Address</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full mt-1 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-text-primary outline-none focus:border-brand"
          placeholder="john.doe@example.com"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-text-secondary">Password</label>
        <div className="relative mt-1 flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3.5 py-2 pr-10 text-sm text-text-primary outline-none focus:border-brand"
            placeholder="Choose a strong password"
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

      <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting} icon={<UserPlus className="h-4 w-4" />}>
        Create Account
      </Button>

      <div className="text-center pt-2">
        <p className="text-xs text-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-brand font-bold hover:underline">
            Sign In Instead
          </Link>
        </p>
      </div>
    </form>
  );
}

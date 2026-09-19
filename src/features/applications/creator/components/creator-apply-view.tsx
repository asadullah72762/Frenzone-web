"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Radio, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatorApplicationForm } from "./creator-application-form";
import { authService } from "@/features/auth/services/auth.service";

export function CreatorApplyView() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    authService
      .getSession()
      .then((s) => {
        setSession(s);
        if (s?.user?.isCreatorVerified) {
          // Auto-redirect to creator hub
          router.replace("/creator");
        }
      })
      .catch(() => {
        // Unauthenticated
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, [router]);

  if (isChecking) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent mx-auto" />
        <p className="text-xs text-text-secondary">Checking creator verification status...</p>
      </div>
    );
  }

  // If already verified, do NOT show or recommend onboarding/application
  if (session?.user?.isCreatorVerified) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-surface to-teal-50/30 p-8 shadow-sm text-center space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            Active Verified Creator
          </span>
          <h2 className="text-2xl font-bold text-text-primary mt-3">
            Welcome back, {session.user.displayName || "Creator"}!
          </h2>
          <p className="text-sm text-text-secondary max-w-md mx-auto mt-2 leading-relaxed">
            You are already an approved, verified Frenzone Creator. You have full access to the Live Studio, diamond earnings, and your Creator Hub.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => router.push("/creator/studio")}
            icon={<Radio className="h-4 w-4" />}
          >
            Go Live Studio
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/creator")}
            icon={<ArrowRight className="h-4 w-4" />}
          >
            Open Creator Hub
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-brand text-sm font-bold tracking-wider uppercase">
            Creator Onboarding
          </p>
          <h1 className="mt-2 text-3xl font-bold text-text-primary">Start your Creator journey</h1>
          <p className="text-text-secondary mt-1 text-sm">
            Complete your onboarding application or explore your creator workspace first.
          </p>
        </div>
        <Link
          href="/creator"
          className="inline-flex items-center space-x-1.5 self-start sm:self-center px-4 py-2 text-xs font-bold text-text-secondary hover:text-brand bg-surface border border-border rounded-xl shadow-xs hover:bg-surface-muted transition-all"
        >
          <span>Skip for now</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="bg-surface mt-8 rounded-xl border border-border p-6 shadow-xs">
        <CreatorApplicationForm />
      </div>
    </>
  );
}

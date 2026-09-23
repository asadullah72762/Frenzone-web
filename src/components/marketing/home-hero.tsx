"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, ShieldCheck, Radio } from "lucide-react";
import { Container } from "@/components/layout/container";
import { authService } from "@/features/auth/services/auth.service";

export function HomeHero() {
  const router = useRouter();
  const [demoLoading, setDemoLoading] = useState<"CREATOR" | "AGENCY" | null>(null);
  const [session, setSession] = useState<any>(null);

  useState(() => {
    authService
      .getSession()
      .then((s) => setSession(s))
      .catch(() => setSession(null));
  });

  const user = session?.user;
  const isCreatorVerified = Boolean(user?.isCreatorVerified || user?.isCreator || user?.creatorStatus === "approved");
  const isAgencyVerified = Boolean(user?.isAgencyVerified || user?.agencyMembership?.agency_id?.status === "approved");

  const handleDemoLaunch = async (role: "CREATOR" | "AGENCY") => {
    setDemoLoading(role);
    try {
      const res = await authService.loginDemo(role);
      if (res.success) {
        router.push(role === "CREATOR" ? "/creator" : "/agency");
      }
    } catch (err) {
      console.error("Failed to launch demo:", err);
    } finally {
      setDemoLoading(null);
    }
  };

  const openPortalHref = isAgencyVerified ? "/agency" : isCreatorVerified ? "/creator" : "/login";

  return (
    <Container className="pt-10 pb-16 md:pt-16 md:pb-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* Left: copy */}
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-text-muted">Frenzone live partner portal</p>
          <h1 className="mt-4 text-[clamp(44px,6vw,72px)] font-normal tracking-[-0.055em] text-text-primary leading-[0.98]">
            Where creators and agencies{" "}
            <em className="text-brand not-italic">grow together.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-text-secondary leading-relaxed">
            A working portal for applications, earnings, compliance, referrals, coin purchasing, transfers and payout requests.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={isCreatorVerified ? "/creator" : "/creator-apply"}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-base font-bold text-white shadow-sm hover:bg-brand-hover transition-colors"
            >
              Apply now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={openPortalHref}
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-base font-bold text-text-primary hover:bg-surface-muted transition-colors"
            >
              Open portal
            </Link>
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-text-secondary">
            <ShieldCheck className="h-4 w-4 text-text-primary" />
            Requests are recorded—not simulated.
          </p>

          {/* Demo access kept available, low-key so it doesn't compete with the primary CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-text-muted">
            <Radio className="h-3.5 w-3.5" />
            <span>Instant demo:</span>
            <button
              type="button"
              onClick={() => handleDemoLaunch("CREATOR")}
              disabled={demoLoading !== null}
              className="text-brand hover:underline disabled:opacity-50"
            >
              {demoLoading === "CREATOR" ? "Launching…" : "Creator"}
            </button>
            <span className="text-border">·</span>
            <button
              type="button"
              onClick={() => handleDemoLaunch("AGENCY")}
              disabled={demoLoading !== null}
              className="text-brand hover:underline disabled:opacity-50"
            >
              {demoLoading === "AGENCY" ? "Launching…" : "Agency"}
            </button>
          </div>
        </div>

        {/* Right: image with floating badge */}
        <div className="relative">
          <div className="overflow-hidden rounded-[2rem]">
            <img
              src="https://frenzone-creator-agency.frenzonelive.chatgpt.site/assets/frenzone-office.jpg"
              alt="Frenzone office"
              className="h-full w-full object-cover aspect-[4/3]"
            />
          </div>
          <div className="absolute bottom-6 left-6 right-6 sm:right-auto rounded-2xl bg-[#0e1320] px-6 py-5 text-white shadow-elevated sm:max-w-xs">
            <Radio className="h-5 w-5 text-brand mb-2" />
            <p className="text-lg font-bold">One connected workspace</p>
            <p className="text-sm text-white/70 mt-0.5">Creator and agency operations</p>
          </div>
        </div>
      </div>
    </Container>
  );
}

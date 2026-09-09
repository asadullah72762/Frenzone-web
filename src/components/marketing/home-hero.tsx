"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Flame, ArrowRight, Video, Building2, Play, Users, DollarSign, ShieldCheck, Heart, Crown, Zap } from "lucide-react";
import { authService } from "@/features/auth/services/auth.service";

export function HomeHero() {
  const router = useRouter();
  const [demoLoading, setDemoLoading] = useState<"CREATOR" | "AGENCY" | null>(null);

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
  return (
    <div className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
      {/* Multi-Tone Gradient Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-brand/15 via-brand-hover/15 to-cta/15 blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 rounded-full bg-brand-soft px-4 py-1.5 text-xs font-extrabold text-brand border border-brand/20 shadow-sm">
              <Flame className="h-4 w-4 text-brand fill-brand" />
              <span className="text-brand">
                Frenzone Creator & Agency Platform 2026
              </span>
            </div>

            <h1 className="text-4xl font-black tracking-tight text-text-primary sm:text-5xl lg:text-6xl leading-[1.1]">
              Empowering{" "}
              <span className="bg-gradient-to-r from-brand via-brand-hover to-cta bg-clip-text text-transparent">
                Live Creators
              </span>{" "}
              & Talent Agencies
            </h1>

            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              The authoritative unified web platform connecting live streaming creators, agency partnerships, guaranteed compliance goals, and digital coin commerce.
            </p>

            {/* CTA Group with Vibrant Multi-Tone Gradient */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/creator-apply"
                className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-extrabold text-white bg-gradient-to-r from-brand via-brand-hover to-cta hover:opacity-95 active:scale-[0.98] shadow-md transition-all text-base space-x-2"
              >
                <span>Apply as Creator</span>
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/agency-apply"
                className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-bold text-text-primary border border-border bg-surface hover:bg-surface-muted transition-all text-base space-x-2 shadow-sm"
              >
                <Building2 className="h-5 w-5 text-brand" />
                <span>Agency Partnership</span>
              </Link>

              <Link href="/login" className="text-xs font-bold text-text-muted hover:text-brand transition-colors pt-2 sm:pt-0 sm:pl-2">
                Sign In to Workspace →
              </Link>
            </div>

            {/* 1-Click Instant Live Demo Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5">
              <div className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-brand uppercase tracking-wider bg-brand-soft/60 px-3 py-1.5 rounded-xl border border-brand/20">
                <Zap className="h-3.5 w-3.5 text-brand fill-brand shrink-0" />
                <span>Instant Live Demo:</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLaunch("CREATOR")}
                  disabled={demoLoading !== null}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-surface border border-brand/30 hover:border-brand text-text-primary hover:text-brand text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {demoLoading === "CREATOR" ? (
                    <div className="h-3.5 w-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Video className="h-3.5 w-3.5 text-brand shrink-0" />
                  )}
                  <span>{demoLoading === "CREATOR" ? "Launching..." : "Demo Creator Hub"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLaunch("AGENCY")}
                  disabled={demoLoading !== null}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-surface border border-cta/30 hover:border-cta text-text-primary hover:text-cta text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {demoLoading === "AGENCY" ? (
                    <div className="h-3.5 w-3.5 border-2 border-cta border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Building2 className="h-3.5 w-3.5 text-cta shrink-0" />
                  )}
                  <span>{demoLoading === "AGENCY" ? "Launching..." : "Demo Agency Portal"}</span>
                </button>
              </div>
            </div>

            {/* Key Trust Pill Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-semibold text-text-muted">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span>80% Creator Revenue Split</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span>20% Agency Commission Model</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span>10% Recurring Referral Split</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Glassmorphism UI Showcase Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl border border-brand/20 bg-surface/80 p-5 shadow-elevated backdrop-blur-md space-y-4">
              {/* Fake Live Stream Overlay Card */}
              <div className="relative h-56 w-full overflow-hidden rounded-xl bg-slate-950 p-4 text-white flex flex-col justify-between shadow-card">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                  alt="Live Streamer Preview"
                  className="absolute inset-0 h-full w-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Top Stream Badges */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-2 rounded-full bg-cta px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    <span>LIVE NOW</span>
                  </div>
                  <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm">
                    4,820 Viewers
                  </span>
                </div>

                {/* Bottom Stream Info */}
                <div className="relative z-10 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm">Alex Rivera (@alex_vibe)</span>
                    <span className="rounded bg-gradient-to-r from-brand to-cta px-1.5 py-0.5 text-[9px] font-bold">VERIFIED</span>
                  </div>
                  <p className="text-xs text-slate-300">Acoustic Live Performance & Fan Q&A</p>
                </div>
              </div>

              {/* Floating Stat Widgets */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-surface p-3.5 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Target Hours</span>
                    <Video className="h-3.5 w-3.5 text-brand" />
                  </div>
                  <p className="text-lg font-bold text-text-primary">42h / 60h</p>
                  <div className="h-1.5 w-full rounded-full bg-surface-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand to-cta w-[70%]" />
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-surface p-3.5 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Est. Earnings</span>
                    <DollarSign className="h-3.5 w-3.5 text-success" />
                  </div>
                  <p className="text-lg font-bold text-success">$3,480.00</p>
                  <span className="text-[10px] font-semibold text-success bg-success-soft px-1.5 py-0.5 rounded">
                    +18.2% this month
                  </span>
                </div>
              </div>

              {/* Verified Badge Bar */}
              <div className="rounded-xl border border-border bg-surface-muted/60 p-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-cta fill-cta" />
                  <span className="font-medium text-text-primary">Gifts Cleared: 124,500 Coins</span>
                </div>
                <span className="font-bold bg-gradient-to-r from-brand to-cta bg-clip-text text-transparent">
                  Frenzone Secured
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

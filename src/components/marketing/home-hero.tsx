"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Flame, ArrowRight, Video, Building2, DollarSign, ShieldCheck, Heart, Clock } from "lucide-react";
import { authService } from "@/features/auth/services/auth.service";

export function HomeHero() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    authService
      .getSession()
      .then((s) => setSession(s))
      .catch(() => setSession(null));
  }, []);

  const user = session?.user;
  const isCreatorVerified = Boolean(user?.isCreatorVerified || user?.isCreator || user?.creatorStatus === "approved");
  const isAgencyVerified = Boolean(user?.isAgencyVerified || user?.agencyMembership?.agency_id?.status === "approved");
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

            {/* CTA Group with Dynamic Awareness for Verified Users */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              {isCreatorVerified ? (
                <Link
                  href="/creator"
                  className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-extrabold text-white bg-gradient-to-r from-brand via-brand-hover to-cta hover:opacity-95 active:scale-[0.98] shadow-md transition-all text-base space-x-2"
                >
                  <Video className="h-5 w-5" />
                  <span>Open Creator Studio</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <Link
                  href="/creator-apply"
                  className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-extrabold text-white bg-gradient-to-r from-brand via-brand-hover to-cta hover:opacity-95 active:scale-[0.98] shadow-md transition-all text-base space-x-2"
                >
                  <span>Apply as Creator</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              )}

              {isAgencyVerified ? (
                <Link
                  href="/agency"
                  className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-bold text-text-primary border border-border bg-surface hover:bg-surface-muted transition-all text-base space-x-2 shadow-sm"
                >
                  <Building2 className="h-5 w-5 text-brand" />
                  <span>Agency Workspace</span>
                </Link>
              ) : (
                <Link
                  href="/agency-apply"
                  className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-bold text-text-primary border border-border bg-surface hover:bg-surface-muted transition-all text-base space-x-2 shadow-sm"
                >
                  <Building2 className="h-5 w-5 text-brand" />
                  <span>Agency Partnership</span>
                </Link>
              )}

              {!user && (
                <Link href="/login" className="text-xs font-bold text-text-muted hover:text-brand transition-colors pt-2 sm:pt-0 sm:pl-2">
                  Sign In to Workspace →
                </Link>
              )}
            </div>

            {/* Trust Pill Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-semibold text-text-muted">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-brand" />
                <span>40h Monthly Live Goal</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span>Transparent Payout Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span>Verified Partner Network</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Glassmorphism UI Showcase Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl border border-brand/20 bg-surface/80 p-5 shadow-elevated backdrop-blur-md space-y-4">
              {/* Hero Image Card */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-2xl bg-slate-950 p-4 text-white flex flex-col justify-between shadow-card group">
                <img
                  src="/assets/frenzone-office.jpg"
                  alt="Frenzone Live Operations Office"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                {/* Top Stream Badges */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-2 rounded-full bg-cta px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    <span>OPERATIONS HQ</span>
                  </div>
                  <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm border border-white/10 text-white/90">
                    Live Ecosystem
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="relative z-10 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-base text-white">One connected workspace</span>
                    <span className="rounded bg-gradient-to-r from-brand to-cta px-1.5 py-0.5 text-[9px] font-bold text-white">OFFICIAL</span>
                  </div>
                  <p className="text-xs text-slate-300">Creator and agency operations for Frenzone Live</p>
                </div>
              </div>

              {/* Floating Stat Widgets */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-surface p-3.5 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Target Hours</span>
                    <Video className="h-3.5 w-3.5 text-brand" />
                  </div>
                  <p className="text-lg font-bold text-text-primary">28h / 40h</p>
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

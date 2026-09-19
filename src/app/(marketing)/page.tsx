import type { Metadata } from "next";
import Link from "next/link";
import {
  Video,
  Building2,
  DollarSign,
  Users,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ShoppingBag,
  Share2,
  Lock,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { HomeHero } from "@/components/marketing/home-hero";
import { HomeCalculatorTabs } from "@/components/marketing/home-calculator-tabs";
import { MarketingCtaButton } from "@/components/marketing/marketing-cta-button";

export const metadata: Metadata = {
  title: "Frenzone Creator & Agency Platform | Live Streaming & Talent Management",
  description:
    "The official web platform for Frenzone Creators, Agency Partners, Coin Commerce, and Referral Networks. Join top streamers and agencies today.",
};

export default function HomePage() {
  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section */}
      <HomeHero />

      {/* 2. Global Live Metrics & Trust Bar */}
      <section className="bg-surface border-y border-border py-10 shadow-sm">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-brand">$2.4M+</p>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Creator Revenue Settled</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-brand">480,000h</p>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Live Stream Hours</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-brand">1,200+</p>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Verified Creators</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-brand">150+</p>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Partner Agencies</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Dual Program Spotlight (Creators vs Agencies) */}
      <Container>
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-extrabold text-brand uppercase tracking-wider">Dual Partnership Ecosystem</span>
          <h2 className="text-3xl font-extrabold text-text-primary sm:text-4xl">Choose Your Frenzone Pathway</h2>
          <p className="text-sm text-text-secondary">Architected specifically for individual creators and talent management agencies.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Creator Spotlight Card */}
          <Card className="p-6 md:p-8 flex flex-col justify-between border-brand/20 shadow-card hover:border-brand transition-all">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand font-bold">
                  <Video className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">80% Creator Split</span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-text-primary">Frenzone Creator Program</h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Turn daily live streams into a full-time career with transparent goal tracking and virtual gift monetization.
                </p>
              </div>

              <ul className="space-y-3 text-xs text-text-secondary border-t border-border pt-4">
                <li className="flex items-center space-x-2">
                  <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                  <span><strong>80% Revenue Share</strong> on stream gifts, tips & subscriptions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                  <span><strong>Guaranteed Targets:</strong> Clear daily/monthly live stream hour goals</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                  <span><strong>10% Referral Bonus:</strong> Earn recurring income by inviting fellow creators</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 flex items-center gap-3">
              <MarketingCtaButton
                type="creator"
                defaultText="Apply as Creator"
                defaultHref="/creator-apply"
                className="flex-1 inline-flex items-center justify-center h-10 px-4 rounded-lg font-bold text-white bg-brand hover:bg-brand-hover active:bg-brand-active shadow-sm text-sm space-x-2"
              />
              <Link
                href="/creators"
                className="inline-flex items-center justify-center h-10 px-4 rounded-lg font-semibold text-text-primary border border-border bg-surface hover:bg-surface-muted text-sm"
              >
                Learn More
              </Link>
            </div>
          </Card>

          {/* Agency Spotlight Card */}
          <Card className="p-6 md:p-8 flex flex-col justify-between border-brand/20 shadow-card hover:border-brand transition-all">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand font-bold">
                  <Building2 className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">20% Agency Split</span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-text-primary">Agency Partnership Program</h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Enterprise portal for talent management agencies to recruit creators, monitor rosters, and collect monthly wire splits.
                </p>
              </div>

              <ul className="space-y-3 text-xs text-text-secondary border-t border-border pt-4">
                <li className="flex items-center space-x-2">
                  <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                  <span><strong>20% Agency Split</strong> on gross stream earnings of your roster</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                  <span><strong>Digital Invitation Suite:</strong> Invite creators with 1-click consent binding</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                  <span><strong>Corporate Settlements:</strong> Automated monthly bank wire disbursements</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 flex items-center gap-3">
              <MarketingCtaButton
                type="agency"
                defaultText="Agency Partnership"
                defaultHref="/agency-apply"
                className="flex-1 inline-flex items-center justify-center h-10 px-4 rounded-lg font-bold text-white bg-brand hover:bg-brand-hover active:bg-brand-active shadow-sm text-sm space-x-2"
              />
              <Link
                href="/agencies"
                className="inline-flex items-center justify-center h-10 px-4 rounded-lg font-semibold text-text-primary border border-border bg-surface hover:bg-surface-muted text-sm"
              >
                Learn More
              </Link>
            </div>
          </Card>
        </div>
      </Container>

      {/* 4. Unified Calculator Teaser */}
      <section className="bg-surface-muted/60 py-12 border-y border-border">
        <Container>
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
            <h2 className="text-3xl font-bold text-text-primary">Interactive Income Calculator</h2>
            <p className="text-sm text-text-secondary">Toggle between Creator earnings and Agency commission projections.</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <HomeCalculatorTabs />
          </div>
        </Container>
      </section>

      {/* 5. Coin Commerce Teaser */}
      <Container>
        <Card className="p-8 md:p-10 bg-gradient-to-br from-surface to-surface-muted border-brand/20 shadow-card">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-extrabold text-brand">
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Public Coin Store</span>
              </div>

              <h2 className="text-3xl font-bold text-text-primary">
                Buy Coins with <span className="text-brand">10% Public Discount</span>
              </h2>

              <p className="text-sm text-text-secondary leading-relaxed">
                Support your favorite creators live! Enjoy an instant 10% discount on all coin packages when purchasing directly on the Frenzone website.
              </p>

              <div className="flex items-center space-x-4 pt-2">
                <Link
                  href="/coins"
                  className="inline-flex items-center justify-center h-10 px-5 rounded-lg font-bold text-white bg-brand hover:bg-brand-hover text-sm space-x-2"
                >
                  <span>Visit Coin Store</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-surface p-6 border border-border space-y-3 shadow-sm text-center">
              <span className="text-xs font-bold text-text-muted uppercase">Sample Package Preview</span>
              <p className="text-2xl font-bold text-text-primary">500 Coins + 50 Bonus</p>
              <div className="flex justify-center items-baseline space-x-2">
                <span className="text-xs text-text-muted line-through">$8.99</span>
                <span className="text-xl font-extrabold text-brand">$8.09 USD</span>
              </div>
              <span className="inline-block text-[11px] font-bold text-success bg-success-soft px-2 py-0.5 rounded">
                10% Public Website Offer Applied
              </span>
            </div>
          </div>
        </Card>
      </Container>

      {/* 6. Final Conversion CTA Banner */}
      <Container>
        <div className="rounded-3xl bg-gradient-to-r from-brand via-brand-hover to-brand-active p-8 md:p-12 text-white text-center space-y-6 shadow-elevated">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Join the Frenzone Ecosystem?
          </h2>

          <p className="text-sm sm:text-base text-brand-soft max-w-2xl mx-auto leading-relaxed">
            Apply today to secure your verified Creator or Agency partnership account.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <MarketingCtaButton
              type="creator"
              defaultText="Apply as Creator"
              defaultHref="/creator-apply"
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-bold text-brand bg-white hover:bg-white/90 text-base shadow-sm space-x-2"
            />
            <MarketingCtaButton
              type="agency"
              defaultText="Agency Partnership"
              defaultHref="/agency-apply"
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-bold text-white border-2 border-white bg-transparent hover:bg-white/10 text-base space-x-2"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Video, ShieldCheck, DollarSign, Coins, Clock, ArrowRight, ChevronDown, Flame, Percent } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MarketingCtaButton } from "@/components/marketing/marketing-cta-button";

export default function CreatorsPage() {
  const [dailyHours, setDailyHours] = useState(3);
  const [avgViewers, setAvgViewers] = useState(1500);

  // Earnings estimation algorithm (mock frontend preview)
  const estGiftsPerDay = (dailyHours * avgViewers * 0.15) * 0.01;
  const estMonthlyEarnings = Math.round(estGiftsPerDay * 22 * 100) / 100;

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Who can apply for the Frenzone Creator Program?",
      a: "Creators who are 18+ with active social media channels and a commitment to high-definition daily live streaming.",
    },
    {
      q: "What is the monthly live streaming requirement?",
      a: "Approved creators commit to a 40-hour monthly live streaming goal to maintain active creator benefits and verified status.",
    },
    {
      q: "What are the coin limits and discounts for verified creators?",
      a: "Creators enjoy a 2M daily coin limit along with a 10% personal purchase discount on coin packages in the store.",
    },
    {
      q: "What is the minimum payout threshold and schedule?",
      a: "The minimum payout threshold is $100. Payouts are settled reliably once your balance meets or exceeds $100 USD.",
    },
  ];

  return (
    <div className="space-y-16 py-12">
      {/* Hero Section */}
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center space-x-2 rounded-full bg-brand-soft px-4 py-1.5 text-xs font-extrabold text-brand border border-brand/20">
              <Flame className="h-4 w-4 text-brand fill-brand" />
              <span>CREATOR PROGRAM</span>
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-text-primary">
              Turn live performance into a <span className="text-brand">sustainable career.</span>
            </h1>

            <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Track goals, earnings, compliance, and payouts in one unified workspace. Built specifically for serious live streamers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <MarketingCtaButton
                type="creator"
                defaultText="Apply now"
                defaultHref="/creator-apply"
                className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-bold text-white bg-brand hover:bg-brand-hover active:bg-brand-active shadow-sm text-base space-x-2"
              />
              <Link href="#calculator">
                <Button size="lg" variant="secondary">
                  Calculate Earnings
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-brand/20 shadow-elevated bg-slate-950">
              <img
                src="/assets/pk-battle-cover.png"
                alt="Frenzone Creator Program"
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Official Creator Metrics Bar (Exact Specifications) */}
      <section className="bg-surface border-y border-border py-10 shadow-sm">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-brand">2M</p>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">daily coin limit</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-brand">40h</p>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">monthly live goal</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-brand">10%</p>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">personal purchase discount</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-brand">$100</p>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">payout threshold</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Interactive Creator Earnings Estimator */}
      <section id="calculator" className="bg-surface-muted/60 py-12 border-y border-border">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-text-primary">Interactive Creator Earnings Estimator</h2>
              <p className="text-sm text-text-secondary">
                Estimate your potential monthly stream income based on daily streaming hours and average viewers.
              </p>
            </div>

            <Card className="p-6 md:p-8 bg-surface shadow-card">
              <div className="grid gap-8 md:grid-cols-2 items-center">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm font-bold text-text-primary mb-2">
                      <span>Daily Streaming Hours</span>
                      <span className="text-brand">{dailyHours} Hours / Day</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={dailyHours}
                      onChange={(e) => setDailyHours(Number(e.target.value))}
                      className="w-full accent-brand cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-bold text-text-primary mb-2">
                      <span>Average Concurrent Viewers</span>
                      <span className="text-brand">{avgViewers.toLocaleString()} Viewers</span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={20000}
                      step={100}
                      value={avgViewers}
                      onChange={(e) => setAvgViewers(Number(e.target.value))}
                      className="w-full accent-brand cursor-pointer"
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-hover p-6 text-white text-center space-y-3 shadow-elevated">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-soft">Estimated Monthly Revenue</span>
                  <p className="text-4xl font-black">
                    ${estMonthlyEarnings.toLocaleString()} <span className="text-sm font-semibold">USD</span>
                  </p>
                  <p className="text-xs text-brand-soft/80">
                    Includes gifts, tips, and average subscriber retention.
                  </p>
                  <div className="pt-2">
                    <MarketingCtaButton
                      type="creator"
                      defaultText="Start Earning as Creator"
                      defaultHref="/creator-apply"
                      className="w-full inline-flex items-center justify-center h-10 px-4 rounded-xl font-bold bg-white text-brand hover:bg-white/90 shadow-sm text-sm space-x-2"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Program Benefits */}
      <Container>
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <h2 className="text-3xl font-bold text-text-primary">Why Creators Choose Frenzone</h2>
          <p className="text-sm text-text-secondary">Designed from the ground up for high-performing video creators.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card className="p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-text-primary">40h Monthly Goal</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Clear, achievable 40-hour monthly live streaming target with transparent real-time tracking.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-text-primary">$100 Payout Threshold</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Fast, dependable settlements starting at a low $100 threshold directly to your verified payout method.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
              <Coins className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-text-primary">2M Daily Coin Limit</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              High daily coin transaction ceilings empowering peak-event support and stream monetization.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
              <Percent className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-text-primary">10% Purchase Discount</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Exclusive 10% discount on personal coin purchases for all verified Frenzone creators.
            </p>
          </Card>
        </div>
      </Container>

      {/* FAQ Section */}
      <Container>
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-text-primary text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-4 text-left font-semibold text-text-primary text-sm hover:bg-surface-muted/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-text-muted transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 pt-1 text-xs text-text-secondary border-t border-border-subtle leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

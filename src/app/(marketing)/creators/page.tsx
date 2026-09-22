"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/layout/container";
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
      a: "Creators who are 18+ with active social media channels (Instagram, TikTok, YouTube) and a commitment to high-definition daily live streaming.",
    },
    {
      q: "How are stream earnings and gift payouts calculated?",
      a: "Virtual gifts sent by live viewers convert to Coins. Frenzone creators receive an 80% revenue split, settled monthly via PayPal or Bank Transfer.",
    },
    {
      q: "What are the daily streaming compliance requirements?",
      a: "Approved creators commit to a minimum 15 streaming days per month, with at least 2 hours per session to maintain active creator status.",
    },
    {
      q: "How does the 10% Creator Referral Program work?",
      a: "When you refer fellow creators with your unique link, you receive a 10% recurring bonus based on their confirmed stream earnings.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <Container className="py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-text-muted">Creator program</p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.08]">
              Turn live performance into a career.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-text-secondary leading-relaxed">
              Track goals, referrals, earnings, compliance and payouts in one workspace.
            </p>
            <MarketingCtaButton
              type="creator"
              defaultText="Apply now"
              defaultHref="/creator-apply"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-base font-bold text-white shadow-sm hover:bg-brand-hover transition-colors"
            />
          </div>
          <div className="overflow-hidden rounded-[2rem] aspect-square">
            <img
              src="https://frenzone-creator-agency.frenzonelive.chatgpt.site/assets/pk-battle-cover.png"
              alt="Frenzone PK battle"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </Container>

      {/* Stats */}
      <section className="bg-surface-muted py-14">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl bg-surface p-6">
              <p className="text-4xl font-black text-text-primary">2M</p>
              <p className="mt-1 text-text-muted">daily coin limit</p>
            </div>
            <div className="rounded-3xl bg-surface p-6">
              <p className="text-4xl font-black text-text-primary">40h</p>
              <p className="mt-1 text-text-muted">monthly live goal</p>
            </div>
            <div className="rounded-3xl bg-surface p-6">
              <p className="text-4xl font-black text-text-primary">10%</p>
              <p className="mt-1 text-text-muted">personal purchase discount</p>
            </div>
            <div className="rounded-3xl bg-surface p-6">
              <p className="text-4xl font-black text-text-primary">$100</p>
              <p className="mt-1 text-text-muted">payout threshold</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Interactive Creator Earnings Estimator */}
      <section id="calculator" className="py-16 border-b border-border">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-text-primary">Interactive Creator Earnings Estimator</h2>
              <p className="text-sm text-text-secondary">
                Estimate your potential monthly stream income based on daily streaming hours and average viewers.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
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

                <div className="rounded-2xl bg-brand p-6 text-white text-center space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/80">Estimated Monthly Revenue</span>
                  <p className="text-4xl font-black">
                    ${estMonthlyEarnings.toLocaleString()} <span className="text-sm font-semibold">USD</span>
                  </p>
                  <p className="text-xs text-white/70">Includes gifts, tips, and average subscriber retention.</p>
                  <div className="pt-2">
                    <MarketingCtaButton
                      type="creator"
                      defaultText="Start Earning as Creator"
                      defaultHref="/creator-apply"
                      className="w-full inline-flex items-center justify-center h-10 px-4 rounded-full font-bold bg-white text-brand hover:bg-white/90 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <Container className="py-16">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-text-primary text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-border bg-surface overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-5 text-left font-bold text-text-primary text-sm hover:bg-surface-muted transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-text-muted transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-1 text-sm text-text-secondary border-t border-border-subtle leading-relaxed">
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

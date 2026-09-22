"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, ShieldCheck, DollarSign, Coins, Users, ArrowRight, ChevronDown, Percent } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MarketingCtaButton } from "@/components/marketing/marketing-cta-button";

export default function AgenciesPage() {
  const [creatorsCount, setCreatorsCount] = useState(15);
  const [avgRevenuePerCreator, setAvgRevenuePerCreator] = useState(4000);

  // Agency revenue estimation
  const grossNetworkRevenue = creatorsCount * avgRevenuePerCreator;
  const estAgencyCommission = Math.round(grossNetworkRevenue * 0.20);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What operations do partner agencies manage on Frenzone?",
      a: "Agencies manage creator rosters, monitor aggregate live streaming hours, execute bulk coin purchases, and handle monthly corporate wire disbursements.",
    },
    {
      q: "What are the coin limits and discounts available for agencies?",
      a: "Agencies receive an elevated 20M daily coin limit, a 20% agency purchase discount on bulk coins, and an 11–18% transfer discount on creator allocations.",
    },
    {
      q: "What is required to become a verified partner agency?",
      a: "Agencies must be registered business entities, complete identity verification, and maintain an active $5,000 security deposit for corporate operations.",
    },
    {
      q: "How are agency creator invitations managed?",
      a: "Agencies issue digital invitations via the Agency Portal. Creators accept with 1-click consent, binding them directly to your agency roster.",
    },
  ];

  return (
    <div className="space-y-16 py-12">
      {/* Hero Section */}
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center space-x-2 rounded-full bg-brand-soft px-4 py-1.5 text-xs font-bold text-brand border border-brand/20">
              <Building2 className="h-3.5 w-3.5" />
              <span>AGENCY PROGRAM</span>
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-text-primary">
              Build a managed <span className="text-brand">creator network.</span>
            </h1>

            <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Manage creators, compliance, commissions, invoices and coin operations in one authoritative workspace.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <MarketingCtaButton
                type="agency"
                defaultText="Apply now"
                defaultHref="/agency-apply"
                className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-bold text-white bg-brand hover:bg-brand-hover active:bg-brand-active shadow-sm text-base space-x-2"
              />
              <Link href="#agency-calculator">
                <Button size="lg" variant="secondary">
                  Calculate Agency Commission
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-brand/20 shadow-elevated bg-slate-950">
              <img
                src="/assets/frenzone-office-wide.png"
                alt="Frenzone Agency Program"
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Official Agency Metrics Bar (Exact Specifications) */}
      <section className="bg-surface border-y border-border py-10 shadow-sm">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-brand">20M</p>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">daily coin limit</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-brand">20%</p>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Agency purchase discount</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-brand">11–18%</p>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">transfer discount</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-brand">$5,000</p>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">security deposit</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Interactive Agency Commission Calculator */}
      <section id="agency-calculator" className="bg-surface-muted/60 py-12 border-y border-border">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-text-primary">Interactive Agency Commission Calculator</h2>
              <p className="text-sm text-text-secondary">
                Estimate monthly agency earnings based on gross network streaming performance across your managed roster.
              </p>
            </div>

            <Card className="p-6 md:p-8 bg-surface shadow-card">
              <div className="grid gap-8 md:grid-cols-2 items-center">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm font-bold text-text-primary mb-2">
                      <span>Managed Creators Roster</span>
                      <span className="text-brand">{creatorsCount} Creators</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={creatorsCount}
                      onChange={(e) => setCreatorsCount(Number(e.target.value))}
                      className="w-full accent-brand cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-bold text-text-primary mb-2">
                      <span>Avg. Gross Revenue per Creator</span>
                      <span className="text-brand">${avgRevenuePerCreator.toLocaleString()} / mo</span>
                    </div>
                    <input
                      type="range"
                      min={500}
                      max={20000}
                      step={500}
                      value={avgRevenuePerCreator}
                      onChange={(e) => setAvgRevenuePerCreator(Number(e.target.value))}
                      className="w-full accent-brand cursor-pointer"
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-hover p-6 text-white text-center space-y-3 shadow-elevated">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-soft">Est. Monthly Agency Commission</span>
                  <p className="text-4xl font-black">
                    ${estAgencyCommission.toLocaleString()} <span className="text-sm font-semibold">USD / mo</span>
                  </p>
                  <p className="text-xs text-brand-soft/80">
                    Gross Network Revenue: ${grossNetworkRevenue.toLocaleString()} USD
                  </p>
                  <div className="pt-2">
                    <MarketingCtaButton
                      type="agency"
                      defaultText="Become Partner Agency"
                      defaultHref="/agency-apply"
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
          <h2 className="text-3xl font-bold text-text-primary">Agency Partnership Infrastructure</h2>
          <p className="text-sm text-text-secondary">Enterprise tools built for talent management and streaming organizations.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card className="p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
              <Coins className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-text-primary">20M Daily Coin Limit</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              High-volume coin management capacity for enterprise agencies and multi-creator support.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
              <Percent className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-text-primary">20% Agency Discount</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Wholesale purchasing discount on official coin stores for direct distribution to creators.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-text-primary">11–18% Transfer Discount</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Tiered margins on coin transfers across your roster, optimizing network profitability.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-text-primary">$5,000 Security Deposit</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Escrow-backed trust deposit ensuring secure operations and instant wholesale credit limits.
            </p>
          </Card>
        </div>
      </Container>

      {/* FAQ Section */}
      <Container>
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-text-primary text-center">Agency FAQ</h2>
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

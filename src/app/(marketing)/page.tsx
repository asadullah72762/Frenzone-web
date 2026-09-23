import type { Metadata } from "next";
import Link from "next/link";
import { User, Building2, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { HomeHero } from "@/components/marketing/home-hero";

export const metadata: Metadata = {
  title: "Frenzone Creator & Agency Platform | Live Streaming & Talent Management",
  description:
    "The official web platform for Frenzone Creators, Agency Partners, Coin Commerce, and Referral Networks. Join top streamers and agencies today.",
};

const pkBattleAssets = [
  "https://frenzone-creator-agency.frenzonelive.chatgpt.site/assets/pk-battle-cover.png",
  "https://frenzone-creator-agency.frenzonelive.chatgpt.site/assets/pk-battle-wolf.png",
  "https://frenzone-creator-agency.frenzonelive.chatgpt.site/assets/pk-battle-motorcycle.png",
  "https://frenzone-creator-agency.frenzonelive.chatgpt.site/assets/pk-gloves.png",
  "https://frenzone-creator-agency.frenzonelive.chatgpt.site/assets/live-gift-lion.png",
];

export default function HomePage() {
  return (
    <div className="pb-4">
      {/* Hero */}
      <HomeHero />

      {/* Choose your pathway */}
      <section className="bg-surface-muted py-16">
        <Container>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-text-muted mb-8">Choose your pathway</p>
          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href="/creators"
              className="group relative rounded-3xl border border-border bg-surface p-8 transition-all hover:border-brand hover:shadow-elevated"
            >
              <div className="flex items-center justify-between">
                <User className="h-9 w-9 text-brand" strokeWidth={1.75} />
                <span className="rounded-full bg-brand/10 border border-brand/20 px-3 py-1 text-xs font-black text-brand tracking-wide">
                  80% REVENUE SHARE
                </span>
              </div>
              <h3 className="mt-5 text-3xl font-bold text-text-primary">Creator program</h3>
              <p className="mt-3 text-text-secondary leading-relaxed">
                Stream live, receive viewer gifts, and grow with fair payouts and recurring referral bonuses.
              </p>
              
              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-5 text-center">
                <div className="rounded-xl bg-surface-muted p-2.5">
                  <span className="block text-lg font-black text-text-primary">80%</span>
                  <span className="block text-[11px] text-text-muted font-medium">Gift Payouts</span>
                </div>
                <div className="rounded-xl bg-surface-muted p-2.5">
                  <span className="block text-lg font-black text-brand">10%</span>
                  <span className="block text-[11px] text-text-muted font-medium">Coin Discount</span>
                </div>
                <div className="rounded-xl bg-surface-muted p-2.5">
                  <span className="block text-lg font-black text-text-primary">10%</span>
                  <span className="block text-[11px] text-text-muted font-medium">Referral Bonus</span>
                </div>
              </div>

              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-text-primary group-hover:text-brand transition-colors">
                Explore Creator Program <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/agencies"
              className="group relative rounded-3xl border border-border bg-surface p-8 transition-all hover:border-brand hover:shadow-elevated"
            >
              <div className="flex items-center justify-between">
                <Building2 className="h-9 w-9 text-brand" strokeWidth={1.75} />
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-black text-emerald-800 tracking-wide">
                  20% AGENCY COMMISSION
                </span>
              </div>
              <h3 className="mt-5 text-3xl font-bold text-text-primary">Agency program</h3>
              <p className="mt-3 text-text-secondary leading-relaxed">
                Recruit talent, manage high-performing creator rosters, and receive monthly corporate wire settlements.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-5 text-center">
                <div className="rounded-xl bg-surface-muted p-2.5">
                  <span className="block text-lg font-black text-emerald-700">20%</span>
                  <span className="block text-[11px] text-text-muted font-medium">Commission Split</span>
                </div>
                <div className="rounded-xl bg-surface-muted p-2.5">
                  <span className="block text-lg font-black text-brand">20%</span>
                  <span className="block text-[11px] text-text-muted font-medium">Purchase Discount</span>
                </div>
                <div className="rounded-xl bg-surface-muted p-2.5">
                  <span className="block text-lg font-black text-text-primary">11–18%</span>
                  <span className="block text-[11px] text-text-muted font-medium">Transfer Discount</span>
                </div>
              </div>

              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-text-primary group-hover:text-brand transition-colors">
                Explore Agency Program <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </Container>
      </section>

      {/* PK battles gallery */}
      <section className="py-16">
        <Container>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-0.04em] text-text-primary mb-8">PK battles, gifts and creator tools.</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {pkBattleAssets.map((src) => (
              <div key={src} className="overflow-hidden rounded-2xl border border-border bg-[#0e1320] aspect-[9/16]">
                <img src={src} alt="Frenzone live experience" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

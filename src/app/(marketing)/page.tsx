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
              className="group rounded-3xl border border-border bg-surface p-8 transition-all hover:border-brand hover:shadow-elevated"
            >
              <User className="h-9 w-9 text-brand" strokeWidth={1.75} />
              <h3 className="mt-5 text-3xl font-bold text-text-primary">Creator program</h3>
              <p className="mt-3 text-text-secondary">Performance, referrals, earnings and payout requests.</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-text-primary group-hover:text-brand transition-colors">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/agencies"
              className="group rounded-3xl border border-border bg-surface p-8 transition-all hover:border-brand hover:shadow-elevated"
            >
              <Building2 className="h-9 w-9 text-brand" strokeWidth={1.75} />
              <h3 className="mt-5 text-3xl font-bold text-text-primary">Agency program</h3>
              <p className="mt-3 text-text-secondary">Creator roster, commissions, invoices and bulk coin operations.</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-text-primary group-hover:text-brand transition-colors">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </Container>
      </section>

      {/* PK battles gallery */}
      <section className="py-16">
        <Container>
          <h2 className="text-4xl font-bold text-text-primary mb-8">PK battles, gifts and creator tools.</h2>
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

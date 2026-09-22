import Link from "next/link";
import { Container } from "./container";
import { ShieldCheck } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="bg-surface text-text-secondary mt-auto border-t border-border py-12 text-sm">
      <Container className="space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Link href="/" className="inline-block">
              <img
                src="/assets/frenzone-logo.png"
                alt="Frenzone Live"
                className="h-8 md:h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-text-muted max-w-sm">
              Creator and agency operations for Frenzone Live. Empowering streamers and talent management worldwide.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-text-secondary">
            <Link href="/creators" className="hover:text-brand transition-colors">Creators</Link>
            <Link href="/agencies" className="hover:text-brand transition-colors">Agencies</Link>
            <Link href="/coins" className="hover:text-brand transition-colors">Buy Coins</Link>
            <Link href="/creator-program-terms" className="hover:text-brand transition-colors">Creator Terms</Link>
            <Link href="/agency-program-terms" className="hover:text-brand transition-colors">Agency Terms</Link>
            <Link href="/login" className="hover:text-brand transition-colors">Portal Sign In</Link>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} Frenzone Live. All rights reserved.</p>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-success" />
            <span>Production SSO, payments and Agora streaming verified.</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

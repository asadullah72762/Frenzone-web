import Link from "next/link";
import { Container } from "./container";

export function MarketingFooter() {
  return (
    <footer className="bg-[#0e1320] text-white mt-auto">
      <Container className="py-12 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3">
            <svg viewBox="0 0 40 40" className="h-7 w-7 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2a18 18 0 1 0 0 36" stroke="var(--color-brand)" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M20 10a10 10 0 1 0 0 20" stroke="var(--color-brand)" strokeWidth="4.5" strokeLinecap="round" />
            </svg>
            <span className="leading-none">
              <span className="block text-lg font-black tracking-tight text-text-primary">
                FREN <span className="text-brand">ZONE</span>
              </span>
              <span className="block text-[9px] font-extrabold tracking-[0.25em] text-text-primary">LIVE</span>
            </span>
          </div>
          <p className="text-sm text-white/70 max-w-xs">Creator and agency operations for Frenzone Live.</p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm font-semibold text-white/85">
          <Link href="/creators" className="hover:text-brand transition-colors">Creators</Link>
          <Link href="/agencies" className="hover:text-brand transition-colors">Agencies</Link>
          <Link href="/coins" className="hover:text-brand transition-colors">Coins</Link>
          <Link href="/login" className="hover:text-brand transition-colors">Portal</Link>
        </div>
      </Container>
      <Container className="pb-8 text-xs text-white/50">
        © {new Date().getFullYear()} Frenzone Live · Production SSO, payments and Agora streaming require external credentials.
      </Container>
    </footer>
  );
}

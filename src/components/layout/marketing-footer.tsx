import Link from "next/link";
import { Container } from "./container";

export function MarketingFooter() {
  return (
    <footer className="bg-[#0e1320] text-white mt-auto">
      <Container className="py-12 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-2xl bg-white px-4 py-2">
            <img
              src="/assets/frenzone-logo.png"
              alt="Frenzone Live"
              className="h-8 w-auto object-contain"
            />
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

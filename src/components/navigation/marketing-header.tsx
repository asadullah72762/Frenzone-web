import Link from "next/link";
import { Zap } from "lucide-react";
import { Container } from "@/components/layout/container";
export function MarketingHeader() {
  return (
    <header className="bg-brand sticky top-0 z-40 border-b border-brand-active shadow-sm">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-white text-xl font-black tracking-tight flex items-center space-x-2">
          <span>Frenzone</span>
        </Link>
        <nav className="text-white/90 hidden gap-6 text-sm font-semibold md:flex items-center">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/creators" className="hover:text-white transition-colors">Creators</Link>
          <Link href="/agencies" className="hover:text-white transition-colors">Agencies</Link>
          <Link href="/coins" className="hover:text-white transition-colors">Coins</Link>
          <Link
            href="/login"
            className="flex items-center space-x-1.5 bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full text-xs font-bold transition-all border border-white/20"
          >
            <Zap className="h-3 w-3 fill-amber-300 text-amber-300" />
            <span>Live Demo</span>
          </Link>
        </nav>
        <div className="flex items-center space-x-3">
          <Link
            className="text-white/90 hover:text-white transition-colors px-3 py-2 text-sm font-semibold"
            href="/login"
          >
            Sign in
          </Link>
          <Link
            className="bg-surface hover:bg-brand-soft transition-colors rounded-xl px-4 py-2 text-sm font-bold text-brand shadow-sm flex items-center space-x-1"
            href="/creator-apply"
          >
            <span>Apply as Creator</span>
          </Link>
        </div>
      </Container>
    </header>
  );
}

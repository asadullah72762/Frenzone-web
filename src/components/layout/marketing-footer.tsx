import Link from "next/link";
import { Container } from "./container";
export function MarketingFooter() {
  return (
    <footer className="bg-surface text-text-secondary mt-auto border-t py-8 text-sm">
      <Container className="flex flex-col justify-between gap-4 sm:flex-row">
        <p>© {new Date().getFullYear()} Frenzone. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/creator-program-terms">Creator terms</Link>
          <Link href="/agency-program-terms">Agency terms</Link>
        </div>
      </Container>
    </footer>
  );
}

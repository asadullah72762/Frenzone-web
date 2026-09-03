import type { ReactNode } from "react";
import { MarketingHeader } from "@/components/navigation/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </>
  );
}

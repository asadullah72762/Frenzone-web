import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
export const metadata: Metadata = {
  title: "Agency Program Terms",
  description: "Frenzone Agency Program terms.",
};
export default function AgencyTermsPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-bold">Agency Program Terms</h1>
      <p className="text-text-secondary mt-4 max-w-2xl">
        Program terms, eligibility, and agreement details will be presented here from
        the approved Frenzone policy source.
      </p>
    </Container>
  );
}

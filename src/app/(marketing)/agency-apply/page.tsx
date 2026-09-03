import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { AgencyApplicationForm } from "@/features/applications/agency/components/agency-application-form";
export const metadata: Metadata = {
  title: "Apply as an Agency",
  description: "Apply to the Frenzone Agency Program.",
};
export default function AgencyApplyPage() {
  return (
    <Container className="max-w-3xl py-12">
      <p className="text-brand text-sm font-bold tracking-wider uppercase">
        Agency application
      </p>
      <h1 className="mt-3 text-3xl font-bold">Become a Frenzone Agency</h1>
      <p className="text-text-secondary mt-3">
        Share your agency details for the Frenzone review process.
      </p>
      <div className="bg-surface mt-8 rounded-xl border p-6">
        <AgencyApplicationForm />
      </div>
    </Container>
  );
}

import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { AgencyApplyView } from "@/features/applications/agency/components/agency-apply-view";

export const metadata: Metadata = {
  title: "Apply as an Agency",
  description: "Apply to the Frenzone Agency Program.",
};

export default function AgencyApplyPage() {
  return (
    <Container className="max-w-3xl py-14 md:py-16">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-text-muted text-center">Program application</p>
      <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-text-primary text-center">Apply as a Frenzone agency.</h1>
      <p className="mt-4 text-center text-text-secondary">Every submission is stored and given a reference for approval tracking.</p>
      <div className="mt-10">
        <AgencyApplyView />
      </div>
    </Container>
  );
}

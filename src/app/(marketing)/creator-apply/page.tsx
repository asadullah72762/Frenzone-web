import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { CreatorApplicationForm } from "@/features/applications/creator/components/creator-application-form";
export const metadata: Metadata = {
  title: "Apply as a Creator",
  description: "Apply to the Frenzone Creator Program.",
};
export default function CreatorApplyPage() {
  return (
    <Container className="max-w-3xl py-12">
      <p className="text-brand text-sm font-bold tracking-wider uppercase">
        Creator application
      </p>
      <h1 className="mt-3 text-3xl font-bold">Start your Creator journey</h1>
      <p className="text-text-secondary mt-3">
        Please provide accurate details. Review and approval are handled by Frenzone.
      </p>
      <div className="bg-surface mt-8 rounded-xl border p-6">
        <CreatorApplicationForm />
      </div>
    </Container>
  );
}

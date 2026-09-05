import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { CreatorApplicationForm } from "@/features/applications/creator/components/creator-application-form";

export const metadata: Metadata = {
  title: "Apply as a Creator",
  description: "Apply to the Frenzone Creator Program.",
};

export default function CreatorApplyPage() {
  return (
    <Container className="max-w-3xl py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-brand text-sm font-bold tracking-wider uppercase">
            Creator Onboarding
          </p>
          <h1 className="mt-2 text-3xl font-bold text-text-primary">Start your Creator journey</h1>
          <p className="text-text-secondary mt-1 text-sm">
            Complete your onboarding application or explore your creator workspace first.
          </p>
        </div>
        <Link
          href="/creator"
          className="inline-flex items-center space-x-1.5 self-start sm:self-center px-4 py-2 text-xs font-bold text-text-secondary hover:text-brand bg-surface border border-border rounded-xl shadow-xs hover:bg-surface-muted transition-all"
        >
          <span>Skip for now</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="bg-surface mt-8 rounded-xl border border-border p-6 shadow-xs">
        <CreatorApplicationForm />
      </div>
    </Container>
  );
}

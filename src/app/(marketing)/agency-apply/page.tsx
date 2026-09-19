import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { AgencyApplyView } from "@/features/applications/agency/components/agency-apply-view";

export const metadata: Metadata = {
  title: "Apply as an Agency",
  description: "Apply to the Frenzone Agency Program.",
};

export default function AgencyApplyPage() {
  return (
    <Container className="max-w-3xl py-12">
      <AgencyApplyView />
    </Container>
  );
}

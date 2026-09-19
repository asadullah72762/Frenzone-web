import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { CreatorApplyView } from "@/features/applications/creator/components/creator-apply-view";

export const metadata: Metadata = {
  title: "Apply as a Creator",
  description: "Apply to the Frenzone Creator Program.",
};

export default function CreatorApplyPage() {
  return (
    <Container className="max-w-3xl py-12">
      <CreatorApplyView />
    </Container>
  );
}

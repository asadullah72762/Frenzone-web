import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Frenzone.",
};

export default function LoginPage() {
  return (
    <Container className="py-16 md:py-24">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-text-muted text-center">One Frenzone account</p>
      <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-text-primary text-center">Sign in to your portal.</h1>
      <p className="mt-4 max-w-xl mx-auto text-center text-text-secondary leading-relaxed">
        Use the same Frenzone account in the mobile app and portal. Your approved Creator or Agency role decides which workspace opens.
      </p>

      <div className="mt-10 max-w-lg mx-auto rounded-3xl border border-border bg-surface p-8 shadow-sm">
        <LoginForm />
      </div>
    </Container>
  );
}

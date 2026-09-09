import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new Frenzone account.",
};

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
      <section className="bg-surface w-full rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1 text-center">
          <Link href="/" className="inline-block text-brand font-black text-2xl tracking-tight mb-1 hover:opacity-90 transition-opacity">
            Frenzone
          </Link>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Create an account</h1>
          <p className="text-xs text-text-secondary">Get started with your Creator or Agency portal</p>
        </div>
        <SignupForm />
      </section>
    </main>
  );
}

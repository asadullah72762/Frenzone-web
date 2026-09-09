import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Frenzone.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
      <section className="bg-surface w-full rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1 text-center">
          <Link href="/" className="inline-block text-brand font-black text-2xl tracking-tight mb-1 hover:opacity-90 transition-opacity">
            Frenzone
          </Link>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Welcome back</h1>
          <p className="text-xs text-text-secondary">Sign in to your workspace</p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}

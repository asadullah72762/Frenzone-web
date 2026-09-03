import type { Metadata } from "next";
import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new Frenzone account to access Creator and Agency portals.",
};

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12">
      <section className="bg-surface w-full rounded-xl border border-border p-6 shadow-sm">
        <p className="text-brand font-black text-lg">Frenzone</p>
        <h1 className="mt-2 text-2xl font-bold">Create an account</h1>
        <p className="text-text-secondary mt-1 text-sm">
          Register your Frenzone user identity to join Creator or Agency programs.
        </p>
        <div className="mt-6">
          <SignupForm />
        </div>
      </section>
    </main>
  );
}

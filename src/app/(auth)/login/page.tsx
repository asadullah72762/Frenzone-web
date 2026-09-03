import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";
export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Frenzone.",
};
export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <section className="bg-surface w-full rounded-xl border p-6">
        <p className="text-brand font-bold">Frenzone</p>
        <h1 className="mt-4 text-3xl font-bold">Welcome back</h1>
        <p className="text-text-secondary mt-2 text-sm">
          Sign in to access your Creator or Agency workspace.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}

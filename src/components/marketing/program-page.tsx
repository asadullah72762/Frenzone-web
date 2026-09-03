import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  Download,
  Link2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
const icons = [Users, BarChart3, CircleDollarSign, ShieldCheck];
type Props = {
  label: string;
  title: string;
  description: string;
  applyHref: string;
  applyLabel: string;
  features: string[];
  requirements: string[];
  steps: string[];
  faq: Array<{ question: string; answer: string }>;
};
export function ProgramPage({
  label,
  title,
  description,
  applyHref,
  applyLabel,
  features,
  requirements,
  steps,
  faq,
}: Props) {
  return (
    <>
      <section className="py-16 md:py-24">
        <Container>
          <p className="text-brand mb-4 text-sm font-bold tracking-wider uppercase">
            {label}
          </p>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
                {title}
              </h1>
              <p className="text-text-secondary mt-5 max-w-2xl text-lg leading-8">
                {description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={applyHref}
                  className="bg-brand inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white"
                >
                  {applyLabel}
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/login"
                  className="rounded-md border px-5 py-3 text-sm font-semibold"
                >
                  Sign in
                </Link>
              </div>
            </div>
            <Card className="bg-brand-soft grid content-center gap-4">
              <p className="text-brand text-sm font-semibold">
                Built for consistent growth
              </p>
              <p className="text-2xl font-semibold">
                Your program, performance, and payouts—one clear workspace.
              </p>
            </Card>
          </div>
        </Container>
      </section>
      <section className="bg-surface-muted border-y py-16">
        <Container>
          <h2 className="text-2xl font-bold">What you get</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = icons[index];
              return (
                <Card key={feature}>
                  <Icon className="text-brand mb-4" />
                  <h3 className="font-semibold">{feature}</h3>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>
      <section className="py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Program expectations</h2>
              <ul className="mt-6 grid gap-3">
                {requirements.map((requirement) => (
                  <li className="text-text-secondary flex gap-3" key={requirement}>
                    <CheckCircle2 className="text-success mt-0.5 size-5 shrink-0" />
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold">How it works</h2>
              <ol className="mt-6 grid gap-4">
                {steps.map((step, index) => (
                  <li className="border-t pt-4" key={step}>
                    <span className="text-brand text-sm font-bold">0{index + 1}</span>
                    <p className="mt-2 font-semibold">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>
      <section className="bg-surface-muted py-16">
        <Container>
          <div className="grid gap-6 rounded-xl border bg-surface p-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-brand flex items-center gap-2 text-sm font-bold"><Link2 size={18} /> Referral growth</p>
              <h2 className="mt-3 text-2xl font-bold">Invite your community to Frenzone.</h2>
              <p className="text-text-secondary mt-2">Your approved portal includes a referral link, QR code, and performance view.</p>
            </div>
            <Link className="text-brand inline-flex items-center gap-2 text-sm font-semibold" href="/login">Open your portal <ArrowRight size={17} /></Link>
          </div>
        </Container>
      </section>
      <section className="py-16">
        <Container className="max-w-3xl">
          <h2 className="text-2xl font-bold">Frequently asked questions</h2>
          <div className="mt-6 divide-y rounded-xl border bg-surface">
            {faq.map((item) => (
              <details className="group p-5" key={item.question}>
                <summary className="cursor-pointer list-none font-semibold">{item.question}</summary>
                <p className="text-text-secondary mt-3 text-sm leading-6">{item.answer}</p>
              </details>
            ))}
          </div>
          <Link href="/creators" className="text-brand mt-8 inline-flex items-center gap-2 text-sm font-semibold"><Download size={17} /> Download Frenzone</Link>
        </Container>
      </section>
    </>
  );
}

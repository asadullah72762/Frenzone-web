import Link from "next/link";
import { Download, ExternalLink, Flame, ShieldCheck, Smartphone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReferralScanTracker } from "@/features/referrals/components/referral-scan-tracker";

type Props = { params: Promise<{ referralCode: string }> };

export default async function ReferralLandingPage({ params }: Props) {
  const { referralCode } = await params;

  return (
    <Container className="py-16 md:py-24">
      <ReferralScanTracker referralCode={referralCode} />
      <div className="mx-auto max-w-2xl text-center space-y-4">
        <span className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50 px-4 py-1.5 text-xs font-bold text-brand border border-brand/20">
          <Flame className="h-4 w-4 text-brand fill-brand" />
          <span className="bg-gradient-to-r from-violet-700 via-indigo-700 to-pink-600 bg-clip-text text-transparent">Exclusive Frenzone Invitation</span>
        </span>

        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl text-text-primary">
          Join <span className="text-brand">Frenzone</span> & Connect Live
        </h1>

        <p className="text-text-secondary text-base leading-relaxed">
          You have been personally invited to join the Frenzone live streaming community.
        </p>
      </div>

      <Card className="mx-auto mt-8 max-w-xl text-center p-8 space-y-6 shadow-card">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-16 w-16 rounded-full bg-brand-soft border-2 border-brand/30 flex items-center justify-center text-brand font-bold text-xl">
            {referralCode.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-text-muted">Invited via Referral Code</p>
            <p className="text-lg font-mono font-bold text-brand mt-0.5">{referralCode}</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href={`/signup?ref=${encodeURIComponent(referralCode)}`}
            className="w-full bg-brand hover:bg-brand-hover text-white inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold shadow-sm transition-colors"
          >
            <span>Register Free with Referral</span>
            <ExternalLink className="h-4 w-4" />
          </Link>

          <a
            href="frenzone://join"
            className="w-full bg-surface-muted hover:bg-surface-muted/80 text-text-primary border border-border inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors"
          >
            <span>Open in Frenzone App</span>
          </a>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 rounded-xl border border-border bg-surface p-3 text-xs font-bold text-text-primary hover:bg-surface-muted transition-colors"
            >
              <Smartphone className="h-4 w-4 text-brand" />
              <span>iOS App Store</span>
            </a>

            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 rounded-xl border border-border bg-surface p-3 text-xs font-bold text-text-primary hover:bg-surface-muted transition-colors"
            >
              <Smartphone className="h-4 w-4 text-brand" />
              <span>Google Play Store</span>
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
          <Link href="/creator-apply" className="font-semibold text-brand hover:underline">
            Want to apply as a Creator? Click here →
          </Link>
          <div className="flex items-center space-x-1">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            <span>Verified Invite</span>
          </div>
        </div>
      </Card>
    </Container>
  );
}

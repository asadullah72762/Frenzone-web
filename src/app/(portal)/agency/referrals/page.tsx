"use client";

import { useState } from "react";
import { Link2, Copy, Check, QrCode, Building2, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AgencyReferralsPage() {
  const [copied, setCopied] = useState(false);
  const link = "https://frenzone.live/agency-apply?ref=AGENCY-APEX2026";
  const code = "AGENCY-APEX2026";

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Agency Partner Referral Network
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Refer sub-agencies and creator managers to Frenzone to build your master agency network.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Link2 className="h-5 w-5 text-brand" />
            <CardTitle>Master Agency Partner Link</CardTitle>
          </div>
          <CardDescription>
            Agencies applying through your partner link connect under your sub-agency network.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              readOnly
              value={link}
              className="w-full rounded-lg border border-border bg-surface-muted px-4 py-2.5 text-xs font-mono text-text-primary outline-none"
            />
            <Button variant="primary" onClick={handleCopy} icon={copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}>
              {copied ? "Copied" : "Copy Link"}
            </Button>
          </div>
          <p className="text-xs text-text-muted">
            Agency Referral Code: <strong className="text-brand">{code}</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Wallet, ShieldCheck, Building2, Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/feedback/status-badge";
import { agencyService } from "@/features/agency/services/agency.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { agencyPayoutAccountMock, agencyDashboardMock } from "@/mocks/agency-full.mock";
import { formatCurrency } from "@/lib/formatting";

export default function AgencyPayoutsPage() {
  const { data: payoutAcc, isLoading } = useAsyncData(
    () => agencyService.getPayoutAccount(),
    [],
    400
  );

  const data = payoutAcc || agencyPayoutAccountMock;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Agency Payout & Settlement Settings
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Bank transfer settlement account details for agency 20% commission disbursements.
          </p>
        </div>
        <StatusBadge status="ACTIVE" customLabel="Bank Verified" />
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Pending Agency Payout"
          value={formatCurrency(agencyDashboardMock.pendingPayout)}
          detail="Settlement date: 15th of month"
          icon={<Wallet className="h-5 w-5" />}
        />
        <StatCard
          label="Payout Schedule"
          value="Monthly 15th"
          detail="Automatic bank wire clearance"
          icon={<Calendar className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand font-bold">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Registered Corporate Bank Account</CardTitle>
              <CardDescription>Verified wire transfer destination for agency commissions.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div className="rounded-lg border border-border p-3.5 bg-surface-muted/40">
              <span className="text-xs text-text-muted">Bank Institution</span>
              <p className="font-bold text-text-primary mt-1">{data.bankName}</p>
            </div>

            <div className="rounded-lg border border-border p-3.5 bg-surface-muted/40">
              <span className="text-xs text-text-muted">Account Holder Name</span>
              <p className="font-bold text-text-primary mt-1">{data.accountHolderName}</p>
            </div>

            <div className="rounded-lg border border-border p-3.5 bg-surface-muted/40">
              <span className="text-xs text-text-muted">Masked Account Number</span>
              <p className="font-mono font-bold text-text-primary mt-1">{data.accountNumberMasked}</p>
            </div>

            <div className="rounded-lg border border-border p-3.5 bg-surface-muted/40">
              <span className="text-xs text-text-muted">SWIFT / BIC Code</span>
              <p className="font-mono font-bold text-text-primary mt-1">{data.swiftBic}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

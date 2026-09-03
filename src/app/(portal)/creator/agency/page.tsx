"use client";

import { Building2, User, Mail, Calendar, ShieldCheck, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/status-badge";
import { creatorService } from "@/features/creator/services/creator.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { creatorAgencyContractMock } from "@/mocks/creator-full.mock";

export default function CreatorAgencyPage() {
  const { data: contract, isLoading } = useAsyncData(
    () => creatorService.getAgencyContract(),
    [],
    400
  );

  const data = contract || creatorAgencyContractMock;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Agency Partnership & Management
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            View your verified agency affiliation, contract details, and assigned manager contacts.
          </p>
        </div>
        <StatusBadge status={data.status} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand font-bold text-lg">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>{data.agencyName}</CardTitle>
              <CardDescription>Agency ID: {data.agencyId} • Partnered since {data.contractStartDate}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border p-4 bg-surface-muted/40 space-y-2">
              <span className="text-xs font-semibold text-text-muted uppercase">Assigned Agency Manager</span>
              <div className="flex items-center space-x-2 pt-1">
                <User className="h-4 w-4 text-brand" />
                <p className="text-sm font-semibold text-text-primary">{data.managerName}</p>
              </div>
              <div className="flex items-center space-x-2 text-xs text-text-secondary">
                <Mail className="h-3.5 w-3.5 text-text-muted" />
                <span>{data.managerEmail}</span>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4 bg-surface-muted/40 space-y-2">
              <span className="text-xs font-semibold text-text-muted uppercase">Contract Terms</span>
              <p className="text-sm font-bold text-text-primary pt-1">
                Commission Split: {data.commissionSplitRate}% Agency Fee
              </p>
              <p className="text-xs text-text-muted">Managed via authoritative backend agency relationship agreement.</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-muted/70 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-5 w-5 text-success" />
              <span className="text-xs font-semibold text-text-primary">Frenzone Official Agency Verification Active</span>
            </div>
            <Button variant="secondary" size="sm" icon={<FileText className="h-4 w-4" />}>
              Download Agreement PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  User,
  Mail,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/status-badge";
import { ErrorState } from "@/components/feedback/error-state";
import { CardSkeleton } from "@/components/ui/skeleton";
import { creatorService } from "@/features/creator/services/creator.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function CreatorAgencyPage() {
  const { data: contract, isLoading, error, refetch } = useAsyncData(
    () => creatorService.getAgencyContract(),
    []
  );

  const [isResponding, setIsResponding] = useState(false);
  const [responseFeedback, setResponseFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleRespond = async (action: "accept" | "reject") => {
    if (!contract?.invitationId) return;
    setIsResponding(true);
    setResponseFeedback(null);
    try {
      const res = await creatorService.respondAgencyInvite(contract.invitationId, action);
      setResponseFeedback({
        type: "success",
        message: res.message || (action === "accept" ? "Invitation accepted! Pending admin review." : "Invitation declined."),
      });
      await refetch();
    } catch (err: any) {
      setResponseFeedback({
        type: "error",
        message: err?.response?.data?.error || err?.message || "Failed to respond to invitation.",
      });
    } finally {
      setIsResponding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="border-b border-border pb-4 space-y-2">
          <div className="h-8 w-64 bg-surface-muted animate-pulse rounded-md" />
          <div className="h-4 w-96 bg-surface-muted animate-pulse rounded-md" />
        </div>
        <CardSkeleton />
      </div>
    );
  }

  if (error && !contract) {
    return (
      <div className="max-w-4xl space-y-6">
        <div className="border-b border-border pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Agency Partnership & Management
          </h1>
        </div>
        <ErrorState
          title="Unable to load agency partnership details"
          description={error.message || "Please check your network connection and try again."}
          onRetry={refetch}
        />
      </div>
    );
  }

  const hasAgency = contract?.hasAgency;
  const status = contract?.status || "NONE";

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
        <StatusBadge
          status={status}
          customLabel={
            status === "ACTIVE"
              ? "Active Partnership"
              : status === "PENDING_CONSENT"
              ? "Action Required: Invite Received"
              : status === "PENDING_ADMIN"
              ? "Pending Admin Approval"
              : "No Agency Affiliation"
          }
        />
      </div>

      {responseFeedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            responseFeedback.type === "success"
              ? "bg-success-soft/30 border-success/30 text-success-dark"
              : "bg-danger-soft/30 border-danger/30 text-danger"
          }`}
        >
          <div className="flex items-center space-x-3">
            {responseFeedback.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-danger flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{responseFeedback.message}</p>
          </div>
          <button
            onClick={() => setResponseFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* STATE 1: PENDING INVITATION FROM AGENCY */}
      {hasAgency && status === "PENDING_CONSENT" && (
        <Card className="border-brand/30 bg-gradient-to-br from-brand-soft/20 via-surface to-surface">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand font-bold text-lg">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg">{contract?.agencyName}</CardTitle>
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">
                      Invited You
                    </span>
                  </div>
                  <CardDescription>
                    Invited {contract?.contractStartDate ? `on ${contract.contractStartDate}` : "recently"}
                    {contract?.country ? ` • ${contract.country}` : ""}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div className="rounded-xl border border-brand/20 bg-surface/80 p-4 space-y-3">
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Partnership Terms & Manager Info
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <span className="text-xs text-text-muted">Agency Commission Split</span>
                  <p className="text-sm font-bold text-text-primary">
                    {contract?.commissionSplitRate || 20}% Agency Fee / {100 - (contract?.commissionSplitRate || 20)}% Creator Share
                  </p>
                  <p className="text-xs text-text-secondary">Standard revenue share for managed live streams</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-text-muted">Assigned Manager</span>
                  <div className="flex items-center space-x-1.5 text-sm font-semibold text-text-primary">
                    <User className="h-3.5 w-3.5 text-brand" />
                    <span>{contract?.managerName}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-text-secondary">
                    <Mail className="h-3 w-3 text-text-muted" />
                    <span>{contract?.managerEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border">
              <p className="text-xs text-text-secondary">
                By accepting, this partnership request will be forwarded to Frenzone administrators for final review and activation.
              </p>
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRespond("reject")}
                  disabled={isResponding}
                  className="w-full sm:w-auto"
                >
                  Decline
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleRespond("accept")}
                  disabled={isResponding}
                  className="w-full sm:w-auto"
                >
                  {isResponding ? "Processing..." : "Accept Partnership"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STATE 2: PENDING ADMIN APPROVAL */}
      {hasAgency && status === "PENDING_ADMIN" && (
        <Card className="border-info/30 bg-gradient-to-br from-info-soft/10 via-surface to-surface">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info-soft text-info font-bold text-lg">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">{contract?.agencyName}</CardTitle>
                <CardDescription>
                  Partnership accepted • Awaiting Frenzone Admin verification
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="rounded-xl border border-border bg-surface-muted/40 p-4 space-y-2">
              <p className="text-sm font-medium text-text-primary">
                Your partnership agreement has been submitted to the Frenzone compliance team.
              </p>
              <p className="text-xs text-text-secondary">
                Once the administrator approves the connection, your profile will be formally activated under {contract?.agencyName} and commission splits will automatically take effect.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="p-3 rounded-lg border border-border bg-surface">
                <span className="text-text-muted">Assigned Manager:</span>{" "}
                <span className="font-semibold text-text-primary">{contract?.managerName}</span> ({contract?.managerEmail})
              </div>
              <div className="p-3 rounded-lg border border-border bg-surface">
                <span className="text-text-muted">Agreed Split:</span>{" "}
                <span className="font-semibold text-text-primary">{contract?.commissionSplitRate || 20}% Agency Fee</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STATE 3: ACTIVE PARTNERSHIP */}
      {hasAgency && status === "ACTIVE" && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand font-bold text-lg">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>{contract?.agencyName}</CardTitle>
                <CardDescription>
                  Agency ID: {contract?.agencyId} • Partnered since {contract?.contractStartDate}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border p-4 bg-surface-muted/40 space-y-2">
                <span className="text-xs font-semibold text-text-muted uppercase">Assigned Agency Manager</span>
                <div className="flex items-center space-x-2 pt-1">
                  <User className="h-4 w-4 text-brand" />
                  <p className="text-sm font-semibold text-text-primary">{contract?.managerName}</p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-text-secondary">
                  <Mail className="h-3.5 w-3.5 text-text-muted" />
                  <span>{contract?.managerEmail}</span>
                </div>
              </div>

              <div className="rounded-lg border border-border p-4 bg-surface-muted/40 space-y-2">
                <span className="text-xs font-semibold text-text-muted uppercase">Contract Terms</span>
                <p className="text-sm font-bold text-text-primary pt-1">
                  Commission Split: {contract?.commissionSplitRate || 20}% Agency Fee
                </p>
                <p className="text-xs text-text-muted">Managed via authoritative backend agency relationship agreement.</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface-muted/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="h-5 w-5 text-success flex-shrink-0" />
                <span className="text-xs font-semibold text-text-primary">Frenzone Official Agency Verification Active</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={<FileText className="h-4 w-4" />}
                onClick={() => window.print()}
              >
                Download Agreement PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STATE 4: NO AGENCY AFFILIATION (EMPTY STATE) */}
      {(!hasAgency || status === "NONE") && (
        <div className="space-y-6">
          <Card className="border-dashed border-border bg-surface-muted/20 text-center p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand mx-auto mb-4">
              <Building2 className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">No Active Agency Partnership</h3>
            <p className="text-text-secondary text-sm max-w-md mx-auto mt-2 leading-relaxed">
              You are currently operating as an independent creator. Talent agencies and management teams on Frenzone can discover your profile and send partnership invitations directly to your account.
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/creator/profile">
                <Button variant="primary" size="sm" icon={<ArrowRight className="h-4 w-4" />}>
                  Complete Creator Profile for Discovery
                </Button>
              </Link>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-5 space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand mb-2">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-text-primary">Official Representation</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Agencies provide sponsorship matchmaking, promotional campaigns, and direct talent guidance.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5 space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand mb-2">
                <FileText className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-text-primary">Transparent Commission</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Standard 20% agency splits are transparently tracked and calculated from authentic stream revenue.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5 space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand mb-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-text-primary">Zero Upfront Cost</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Invitations require your explicit review and consent before any contractual affiliation takes effect.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

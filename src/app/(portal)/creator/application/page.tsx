"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Video,
  ShieldCheck,
  ShieldAlert,
  FileText,
  UserCheck,
  Radio,
  Sparkles,
  Info,
  Calendar,
  Mail,
  Phone,
  Globe,
  Tag,
  Share2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/status-badge";
import { LiveAccessDeniedModal } from "@/features/creator/components/live-access-denied-modal";
import {
  creatorApplicationService,
  type ApplicationStatusResponse,
} from "@/features/applications/creator/services/creator-application.service";
import { creatorLiveService } from "@/features/creator/services/creator-live.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function CreatorApplicationPage() {
  const router = useRouter();
  const [isCheckingLive, setIsCheckingLive] = useState(false);
  const [deniedModal, setDeniedModal] = useState<{
    isOpen: boolean;
    reason?: string;
    message?: string;
  }>({ isOpen: false });

  const {
    data: statusData,
    isLoading,
    error,
    refetch,
  } = useAsyncData(() => creatorApplicationService.getStatus(), [], 300);

  const handleGoLive = async () => {
    setIsCheckingLive(true);
    try {
      const status = await creatorLiveService.checkLiveStatus();
      if (status.authorized) {
        router.push("/creator/studio");
      } else {
        setDeniedModal({
          isOpen: true,
          reason: status.reason || "not_eligible",
          message: status.message || "You are not authorized to broadcast from the Live Studio at this time.",
        });
      }
    } catch (err: any) {
      setDeniedModal({
        isOpen: true,
        reason: "not_eligible",
        message: err?.message || "Failed to verify live broadcasting authorization.",
      });
    } finally {
      setIsCheckingLive(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-4 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="space-y-2">
            <div className="h-8 w-64 rounded-lg bg-surface-muted" />
            <div className="h-4 w-96 rounded-lg bg-surface-muted" />
          </div>
          <div className="h-10 w-32 rounded-lg bg-surface-muted" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-surface-muted border border-border" />
          ))}
        </div>
        <div className="h-72 rounded-2xl bg-surface-muted border border-border" />
      </div>
    );
  }

  if (error && !statusData) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-surface rounded-2xl border border-destructive/20 text-center space-y-4 shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-primary">Failed to load application details</h2>
          <p className="text-xs text-text-secondary mt-1">
            {error.message || "Unable to retrieve your creator application status from the server."}
          </p>
        </div>
        <Button variant="primary" onClick={refetch} icon={<RefreshCw className="h-4 w-4" />}>
          Retry Connection
        </Button>
      </div>
    );
  }

  const app = statusData?.application;
  const status = statusData?.status || "none";
  const hasApplied = Boolean(statusData?.hasApplied);
  const complianceStatus = statusData?.complianceStatus || "none";
  const liveAccess = Boolean(statusData?.liveAccess);
  const isApproved = status === "approved";
  const isPending = status === "pending";
  const isMoreInfoRequired = status === "more_info_required";
  const isRejected = status === "rejected";
  const isSuspended = status === "suspended";

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Creator Application
            </h1>
            <StatusBadge
              status={
                isApproved
                  ? "COMPLETED"
                  : isPending
                  ? "PENDING"
                  : isMoreInfoRequired
                  ? "PARTIAL"
                  : isRejected
                  ? "REVOKED"
                  : "NOT_STARTED"
              }
            />
          </div>
          <p className="text-text-secondary mt-1 text-sm">
            Review your creator program enrollment status, compliance approval, and live broadcasting privileges.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={refetch}
            icon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleGoLive}
            disabled={isCheckingLive}
            icon={isCheckingLive ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Radio className="h-4 w-4" />}
          >
            {isCheckingLive ? "Verifying Access..." : "Go Live Studio"}
          </Button>
        </div>
      </div>

      {/* 4-Tier Server Authoritative Status Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Tier 1: Creator Application */}
        <div className="rounded-xl border border-border bg-surface p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">1. Application</span>
            {isApproved ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : isPending ? (
              <Clock className="h-4 w-4 text-amber-500 animate-pulse" />
            ) : (
              <AlertCircle className="h-4 w-4 text-text-muted" />
            )}
          </div>
          <div className="text-base font-bold text-text-primary capitalize">
            {isApproved ? "Approved" : isPending ? "Pending Review" : isMoreInfoRequired ? "Action Required" : isRejected ? "Rejected" : "Not Submitted"}
          </div>
          <p className="text-xs text-text-muted">
            {isApproved ? "Program application approved" : isPending ? "Compliance review queued" : isMoreInfoRequired ? "Additional info required" : "No application on file"}
          </p>
        </div>

        {/* Tier 2: Compliance Verification */}
        <div className="rounded-xl border border-border bg-surface p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">2. Compliance</span>
            {complianceStatus === "approved" ? (
              <ShieldCheck className="h-4 w-4 text-success" />
            ) : complianceStatus === "pending" ? (
              <Clock className="h-4 w-4 text-amber-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-text-muted" />
            )}
          </div>
          <div className="text-base font-bold text-text-primary capitalize">
            {complianceStatus === "approved" ? "Verified" : complianceStatus === "pending" ? "Verification Pending" : "Not Verified"}
          </div>
          <p className="text-xs text-text-muted">
            {complianceStatus === "approved" ? "Identity and safety verified" : "Required for payouts and studio"}
          </p>
        </div>

        {/* Tier 3: Creator Approval Privileges */}
        <div className="rounded-xl border border-border bg-surface p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">3. Creator Status</span>
            {isApproved ? (
              <UserCheck className="h-4 w-4 text-brand" />
            ) : (
              <Clock className="h-4 w-4 text-text-muted" />
            )}
          </div>
          <div className="text-base font-bold text-text-primary">
            {isApproved ? "Active Creator" : "Applicant"}
          </div>
          <p className="text-xs text-text-muted">
            {isApproved ? "Creator Hub tools unlocked" : "Locked until application approval"}
          </p>
        </div>

        {/* Tier 4: Live Access Privileges */}
        <div className="rounded-xl border border-border bg-surface p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">4. Live Studio</span>
            {liveAccess && isApproved ? (
              <Radio className="h-4 w-4 text-success animate-pulse" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-amber-500" />
            )}
          </div>
          <div className="text-base font-bold text-text-primary">
            {liveAccess && isApproved ? "Access Granted" : "Restricted"}
          </div>
          <p className="text-xs text-text-muted">
            {liveAccess && isApproved ? "Browser studio ready to stream" : "Requires approved creator status"}
          </p>
        </div>
      </div>

      {/* ── STATE A: NOT SUBMITTED ── */}
      {!hasApplied && !isApproved && (
        <Card className="border-brand/20 bg-gradient-to-b from-brand/5 to-surface">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Join the Frenzone Creator Program</CardTitle>
                <CardDescription>
                  Start your application today to unlock live broadcasting, tips, and diamond earnings.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-surface p-4">
                <Video className="h-5 w-5 text-brand mb-2" />
                <h4 className="text-sm font-bold text-text-primary">Browser Live Studio</h4>
                <p className="text-xs text-text-muted mt-1">
                  Broadcast directly in high-definition video without third-party encoders.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4">
                <Sparkles className="h-5 w-5 text-success mb-2" />
                <h4 className="text-sm font-bold text-text-primary">Diamond Rewards</h4>
                <p className="text-xs text-text-muted mt-1">
                  Earn diamond gifts from viewers and convert them directly into USD payouts.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4">
                <Share2 className="h-5 w-5 text-indigo-500 mb-2" />
                <h4 className="text-sm font-bold text-text-primary">10% Referral Network</h4>
                <p className="text-xs text-text-muted mt-1">
                  Invite fellow creators and earn a recurring 10% bonus on their stream earnings.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/60 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-text-muted flex items-center space-x-2">
              <Info className="h-4 w-4 text-brand" />
              <span>Applications are reviewed by our platform team within 24–48 hours.</span>
            </div>
            <Button
              variant="primary"
              onClick={() => router.push("/creator-apply")}
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Start Creator Application
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* ── STATE C: PENDING REVIEW ── */}
      {isPending && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Clock className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <CardTitle>Application Under Review</CardTitle>
                <CardDescription>
                  Your creator onboarding application has been submitted and is in the compliance queue.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="rounded-xl border border-amber-500/20 bg-surface p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-semibold text-text-muted">Review Timeline</span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Typically 24–48 Hours</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-semibold text-text-muted">Application Submitted</span>
                <span className="text-xs font-medium text-text-primary">
                  {app?.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Recently"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted">Live Studio Status</span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Locked Pending Approval</span>
              </div>
            </div>

            <div className="rounded-xl bg-surface-muted/60 p-4 border border-border flex items-start space-x-3 text-xs text-text-secondary">
              <Info className="h-4 w-4 text-brand shrink-0 mt-0.5" />
              <div>
                <strong className="text-text-primary block mb-0.5">What happens next?</strong>
                Our team verifies your submitted profile and identity. Once approved, you will receive full access to the browser Live Studio, custom stream overlays, and direct monetization.
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/60 pt-4 flex items-center justify-between">
            <span className="text-xs text-text-muted">Have questions about your application?</span>
            <Link
              href="/creator/support"
              className="text-xs font-bold text-brand hover:underline inline-flex items-center space-x-1"
            >
              <span>Contact Creator Support</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>
      )}

      {/* ── STATE D: APPROVED ── */}
      {isApproved && (
        <Card className="border-success/30 bg-success/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/20 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Creator Program Approved</CardTitle>
                  <CardDescription>
                    Congratulations! Your creator credentials are fully authorized and active on Frenzone.
                  </CardDescription>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-bold text-success">
                <span className="h-2 w-2 rounded-full bg-success animate-ping" />
                Active Creator
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-surface p-4 space-y-1">
                <span className="text-xs text-text-muted font-semibold">Approval Status</span>
                <p className="text-sm font-bold text-success">Approved & Enrolled</p>
                <p className="text-xs text-text-muted">Official Creator Roster</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4 space-y-1">
                <span className="text-xs text-text-muted font-semibold">Compliance Status</span>
                <p className="text-sm font-bold text-text-primary capitalize">{complianceStatus}</p>
                <p className="text-xs text-text-muted">Identity & Safety Approved</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4 space-y-1">
                <span className="text-xs text-text-muted font-semibold">Live Studio Access</span>
                <p className="text-sm font-bold text-brand">{liveAccess ? "Unlocked & Ready" : "Restricted"}</p>
                <p className="text-xs text-text-muted">Web RTC 1080p Host</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/60 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-text-muted">
              Approved on {app?.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : "Verified"}
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="secondary" size="sm" onClick={() => router.push("/creator")}>
                Creator Overview
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleGoLive}
                disabled={isCheckingLive}
                icon={<Radio className="h-4 w-4" />}
              >
                Launch Live Studio
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* ── STATE E: REJECTED ── */}
      {isRejected && (
        <Card className="border-rose-500/30 bg-rose-500/5">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Application Not Approved</CardTitle>
                <CardDescription>
                  Your creator application does not currently satisfy the program qualification guidelines.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {app?.admin_review?.more_info_requested_message && (
              <div className="rounded-xl border border-rose-500/20 bg-surface p-4 space-y-1 text-xs">
                <span className="font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Review Feedback</span>
                <p className="text-text-primary mt-1">{app.admin_review.more_info_requested_message}</p>
              </div>
            )}
            <div className="rounded-xl bg-surface-muted/60 p-4 border border-border text-xs text-text-secondary space-y-2">
              <strong className="text-text-primary block">How to qualify in the future:</strong>
              <ul className="list-disc pl-4 space-y-1">
                <li>Build an active following on supported platforms (Instagram, TikTok, YouTube).</li>
                <li>Complete identity verification through account settings.</li>
                <li>Reach at least 1,000 platform followers or maintain good standing in community guidelines.</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/60 pt-4 flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => router.push("/creator/support")}>
              Contact Creator Support
            </Button>
            <Button variant="primary" size="sm" onClick={() => router.push("/creator-apply")}>
              Submit New Application
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* ── STATE F: NEEDS ACTION / MORE INFO REQUIRED ── */}
      {isMoreInfoRequired && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Action Required on Application</CardTitle>
                <CardDescription>
                  The compliance team has requested additional information to complete your onboarding review.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {app?.admin_review?.more_info_requested_message && (
              <div className="rounded-xl border border-amber-500/30 bg-surface p-4 space-y-1 text-xs">
                <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Compliance Notice</span>
                <p className="text-text-primary mt-1">{app.admin_review.more_info_requested_message}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-border/60 pt-4 flex items-center justify-between">
            <span className="text-xs text-text-muted">Please update your application details to proceed.</span>
            <Button variant="primary" size="sm" onClick={() => router.push("/creator-apply")}>
              Update Application Details
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* ── STATE G: SUSPENDED ── */}
      {isSuspended && (
        <Card className="border-rose-500/40 bg-rose-500/5">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Creator Privileges Suspended</CardTitle>
                <CardDescription>
                  Your creator privileges are temporarily suspended pending platform policy compliance review.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-2 text-xs text-text-secondary">
            <p>Live streaming and monetization tools are disabled while an account review is in progress.</p>
          </CardContent>
          <CardFooter className="border-t border-border/60 pt-4 flex items-center justify-between">
            <span className="text-xs text-text-muted">Need to file an appeal?</span>
            <Button variant="outline" size="sm" onClick={() => router.push("/creator/support")}>
              Contact Creator Support
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Application Summary Card (Rendered if application exists) */}
      {app && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-text-primary">Submitted Application Profile</CardTitle>
                  <CardDescription className="text-xs text-text-muted">
                    Authoritative enrollment record stored on your Frenzone account
                  </CardDescription>
                </div>
              </div>
              <span className="text-xs font-mono text-text-muted">ID: {app._id?.slice(-8)}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 text-xs">
              <div className="rounded-lg border border-border p-3 bg-surface-muted/30">
                <div className="flex items-center space-x-2 text-text-muted mb-1">
                  <FileText className="h-3.5 w-3.5" />
                  <span className="font-semibold">Legal Name</span>
                </div>
                <p className="text-sm font-bold text-text-primary capitalize">
                  {app.legal_name?.firstname} {app.legal_name?.lastname}
                </p>
              </div>

              <div className="rounded-lg border border-border p-3 bg-surface-muted/30">
                <div className="flex items-center space-x-2 text-text-muted mb-1">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="font-semibold">Contact Email</span>
                </div>
                <p className="text-sm font-bold text-text-primary truncate">
                  {app.contact_info?.email || "—"}
                </p>
              </div>

              <div className="rounded-lg border border-border p-3 bg-surface-muted/30">
                <div className="flex items-center space-x-2 text-text-muted mb-1">
                  <Phone className="h-3.5 w-3.5" />
                  <span className="font-semibold">Phone</span>
                </div>
                <p className="text-sm font-bold text-text-primary">
                  {app.contact_info?.phone || "—"}
                </p>
              </div>

              <div className="rounded-lg border border-border p-3 bg-surface-muted/30">
                <div className="flex items-center space-x-2 text-text-muted mb-1">
                  <Globe className="h-3.5 w-3.5" />
                  <span className="font-semibold">Country & Language</span>
                </div>
                <p className="text-sm font-bold text-text-primary">
                  {app.demographics?.country} ({app.demographics?.language})
                </p>
              </div>

              <div className="rounded-lg border border-border p-3 bg-surface-muted/30">
                <div className="flex items-center space-x-2 text-text-muted mb-1">
                  <Tag className="h-3.5 w-3.5" />
                  <span className="font-semibold">Content Category</span>
                </div>
                <p className="text-sm font-bold text-text-primary capitalize">
                  {app.content_profile?.category || "Lifestyle"}
                </p>
              </div>

              <div className="rounded-lg border border-border p-3 bg-surface-muted/30">
                <div className="flex items-center space-x-2 text-text-muted mb-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="font-semibold">Submission Date</span>
                </div>
                <p className="text-sm font-bold text-text-primary">
                  {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>

            {/* Social platform profiles */}
            {app.content_profile?.social_links && (
              <div className="pt-2 border-t border-border">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
                  Submitted Social Profiles
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(app.content_profile.social_links).map(([platform, link]) => {
                    if (!link) return null;
                    return (
                      <span
                        key={platform}
                        className="inline-flex items-center space-x-1.5 rounded-lg border border-border bg-surface px-3 py-1 text-xs font-medium text-text-primary"
                      >
                        <span className="capitalize text-text-muted font-bold">{platform}:</span>
                        <span className="font-mono text-brand">{String(link)}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Live Access Denied Modal */}
      <LiveAccessDeniedModal
        isOpen={deniedModal.isOpen}
        onClose={() => setDeniedModal({ isOpen: false })}
        reason={deniedModal.reason}
        message={deniedModal.message}
      />
    </div>
  );
}

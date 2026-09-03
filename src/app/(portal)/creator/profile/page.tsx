"use client";

import { useState } from "react";
import { User, Mail, Phone, Globe, Shield, Save, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/status-badge";
import { creatorService } from "@/features/creator/services/creator.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { FormSkeleton } from "@/components/ui/skeleton";
import { creatorProfileMock } from "@/mocks/creator-full.mock";

export default function CreatorProfilePage() {
  const { data: profile, isLoading } = useAsyncData(
    () => creatorService.getProfile(),
    [],
    400
  );

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const data = profile || creatorProfileMock;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    }, 600);
  };

  if (isLoading) return <FormSkeleton />;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Creator Profile & Account Settings
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Manage your verified creator identity, bio, social connections, and payout preferences.
          </p>
        </div>
        <StatusBadge status={data.status} />
      </div>

      {successMsg && (
        <div className="rounded-xl border border-success/30 bg-success-soft p-4 text-sm font-medium text-success flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle>Personal & Channel Identity</CardTitle>
            <CardDescription>
              Your public handle and legal verified contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 pb-2">
              <img
                src={data.avatarUrl}
                alt={data.fullName}
                className="h-16 w-16 rounded-full object-cover border-2 border-brand/20 shadow-sm"
              />
              <div>
                <p className="font-bold text-text-primary text-base">@{data.username}</p>
                <p className="text-xs text-text-muted">Creator ID: {data.id} • Member since {data.agreementSignedDate}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-text-secondary">Full Legal Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="text"
                    defaultValue={data.fullName}
                    className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary">Email Address</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="email"
                    defaultValue={data.email}
                    className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary">Phone Number</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="text"
                    defaultValue={data.phone}
                    className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary">Country / Region</label>
                <div className="relative mt-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="text"
                    defaultValue={data.country}
                    className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary">Creator Channel Bio</label>
              <textarea
                rows={3}
                defaultValue={data.bio}
                className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Social Handles</CardTitle>
            <CardDescription>
              Verified platforms used for audience cross-promotion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-xs font-semibold text-text-secondary">Instagram</label>
                <input
                  type="text"
                  defaultValue={data.socialLinks.instagram}
                  className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary">TikTok</label>
                <input
                  type="text"
                  defaultValue={data.socialLinks.tiktok}
                  className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary">YouTube Channel</label>
                <input
                  type="text"
                  defaultValue={data.socialLinks.youtube}
                  className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payout Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Payout Preferences</CardTitle>
            <CardDescription>
              Destination account for monthly earnings disbursements.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-surface-muted/60 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-brand" />
                <div>
                  <p className="text-sm font-semibold text-text-primary">{data.paymentMethod.type} Connected</p>
                  <p className="text-xs text-text-muted">{data.paymentMethod.details}</p>
                </div>
              </div>
              <StatusBadge status="ACTIVE" customLabel="Verified" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" size="lg" isLoading={isSaving} icon={<Save className="h-4 w-4" />}>
            Save Profile Settings
          </Button>
        </div>
      </form>
    </div>
  );
}

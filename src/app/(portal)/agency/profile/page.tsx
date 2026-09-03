"use client";

import { useState } from "react";
import { Building2, Mail, Phone, MapPin, ShieldCheck, Save, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/status-badge";
import { agencyService } from "@/features/agency/services/agency.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { FormSkeleton } from "@/components/ui/skeleton";
import { agencyProfileMock } from "@/mocks/agency-full.mock";

export default function AgencyProfilePage() {
  const { data: profile, isLoading } = useAsyncData(
    () => agencyService.getProfile(),
    [],
    400
  );

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const data = profile || agencyProfileMock;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 600);
  };

  if (isLoading) return <FormSkeleton />;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Agency Profile & Business Details
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Official agency registration, tax identification, and primary contact information.
          </p>
        </div>
        <StatusBadge status={data.status} />
      </div>

      {success && (
        <div className="rounded-xl border border-success/30 bg-success-soft p-4 text-sm font-medium text-success flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Agency profile saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand font-bold">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>{data.agencyName}</CardTitle>
                <CardDescription>Agency ID: {data.id} • Registered in {data.country}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-text-secondary">Legal Agency Name</label>
                <input
                  type="text"
                  defaultValue={data.agencyName}
                  className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary">Registration / Business Number</label>
                <input
                  type="text"
                  defaultValue={data.registrationNumber}
                  className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary">Tax ID / EIN</label>
                <input
                  type="text"
                  defaultValue={data.taxId}
                  className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary">Official Website</label>
                <input
                  type="text"
                  defaultValue={data.website}
                  className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary">Business Address</label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  defaultValue={data.businessAddress}
                  className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Primary Contact Details */}
        <Card>
          <CardHeader>
            <CardTitle>Primary Agency Contact</CardTitle>
            <CardDescription>
              Key contact person for Frenzone agency operations and settlement communications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-xs font-semibold text-text-secondary">Contact Name</label>
                <input
                  type="text"
                  defaultValue={data.mainContactName}
                  className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary">Contact Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="email"
                    defaultValue={data.mainContactEmail}
                    className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary">Contact Phone</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="text"
                    defaultValue={data.mainContactPhone}
                    className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" size="lg" isLoading={isSaving} icon={<Save className="h-4 w-4" />}>
            Save Agency Profile
          </Button>
        </div>
      </form>
    </div>
  );
}

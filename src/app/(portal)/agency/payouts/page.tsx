"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Wallet,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Edit3,
  PlusCircle,
  RefreshCw,
  Loader2,
  X,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { agencyService } from "@/features/agency/services/agency.service";
import { formatCurrency } from "@/lib/formatting";
import type { AgencyPayoutAccount, AgencyDisbursementItem, UpdateAgencyPayoutAccountInput } from "@/types/agency";

export default function AgencyPayoutsPage() {
  const [account, setAccount] = useState<AgencyPayoutAccount | null>(null);
  const [disbursements, setDisbursements] = useState<AgencyDisbursementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<UpdateAgencyPayoutAccountInput>({
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    swift_bic: "",
    routing_number: "",
    iban: "",
    currency: "USD",
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [accRes, disbRes] = await Promise.all([
        agencyService.getPayoutAccount(),
        agencyService.getDisbursements(),
      ]);
      setAccount(accRes);
      setDisbursements(disbRes);

      // Pre-fill form
      if (accRes) {
        setFormData({
          bank_name: accRes.bankName || "",
          account_holder_name: accRes.accountHolderName || "",
          account_number: "",
          swift_bic: accRes.swiftBic || "",
          routing_number: accRes.routingNumber || "",
          iban: accRes.iban || "",
          currency: accRes.currency || "USD",
        });
      }
    } catch (err: any) {
      console.error("Failed to load payout account details:", err);
      setError(err?.message || "Failed to load settlement account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmitAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!formData.bank_name.trim()) {
      setFormError("Bank institution name is required.");
      return;
    }
    if (!formData.account_holder_name.trim()) {
      setFormError("Corporate account holder name is required.");
      return;
    }
    if (!formData.account_number?.trim() && !formData.iban?.trim()) {
      setFormError("Account Number or IBAN is required.");
      return;
    }
    if (!formData.swift_bic.trim()) {
      setFormError("SWIFT / BIC code is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const updated = await agencyService.updatePayoutAccount(formData);
      setAccount(updated);
      setFormSuccess("Corporate bank settlement account verified successfully!");
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess(null);
      }, 1200);
    } catch (err: any) {
      console.error("Update account failed:", err);
      setFormError(err?.message || "Failed to update corporate bank details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isConfigured = Boolean(account?.bankName && account?.accountNumberMasked);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Agency Payout & Settlement Settings
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Corporate Treasury bank wire settlement details for agency 20% stream revenue commission disbursements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isConfigured ? (
            <StatusBadge status="ACTIVE" customLabel="Bank Verified" />
          ) : (
            <StatusBadge status="PENDING" customLabel="Action Required" />
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            icon={isConfigured ? <Edit3 className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
          >
            {isConfigured ? "Update Bank Details" : "Register Bank Account"}
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center justify-between text-sm text-red-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="secondary" size="sm" onClick={fetchData}>
            Retry
          </Button>
        </div>
      )}

      {/* KPI Stats */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Pending Agency Commission"
            value={formatCurrency(account?.pendingPayout || { amount: "0.00", currency: "USD" })}
            detail={`Settlement target: ${account?.nextSettlementDate || "15th of month"}`}
            icon={<Wallet className="h-5 w-5" />}
          />
          <StatCard
            label="Payout Schedule"
            value="Monthly 15th"
            detail="Automatic Corporate Treasury wire clearance"
            icon={<Calendar className="h-5 w-5" />}
          />
        </div>
      )}

      {/* Registered Bank Account Card */}
      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : isConfigured ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand font-bold">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>Registered Corporate Bank Account</CardTitle>
                  <CardDescription>Verified wire transfer destination for monthly commission disbursements.</CardDescription>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(true)}>
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div className="rounded-lg border border-border p-3.5 bg-surface-muted/40">
                <span className="text-xs text-text-muted">Bank Institution</span>
                <p className="font-bold text-text-primary mt-1">{account?.bankName}</p>
              </div>

              <div className="rounded-lg border border-border p-3.5 bg-surface-muted/40">
                <span className="text-xs text-text-muted">Account Holder Name</span>
                <p className="font-bold text-text-primary mt-1">{account?.accountHolderName}</p>
              </div>

              <div className="rounded-lg border border-border p-3.5 bg-surface-muted/40">
                <span className="text-xs text-text-muted">Masked Account / IBAN</span>
                <p className="font-mono font-bold text-text-primary mt-1">{account?.accountNumberMasked}</p>
              </div>

              <div className="rounded-lg border border-border p-3.5 bg-surface-muted/40">
                <span className="text-xs text-text-muted">SWIFT / BIC Code</span>
                <p className="font-mono font-bold text-text-primary mt-1">{account?.swiftBic}</p>
              </div>

              {account?.routingNumber && (
                <div className="rounded-lg border border-border p-3.5 bg-surface-muted/40">
                  <span className="text-xs text-text-muted">Routing / Sort Code</span>
                  <p className="font-mono font-bold text-text-primary mt-1">{account.routingNumber}</p>
                </div>
              )}

              <div className="rounded-lg border border-border p-3.5 bg-surface-muted/40">
                <span className="text-xs text-text-muted">Settlement Currency</span>
                <p className="font-bold text-text-primary mt-1">{account?.currency || "USD"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg mt-2">
              <ShieldCheck className="h-4 w-4 flex-shrink-0" />
              <span>
                Account verified for automated Corporate Treasury bank wires on the 15th of each calendar month.
              </span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-brand/40 bg-brand/5">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <div className="h-12 w-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-3">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">No Corporate Bank Account Configured</h3>
            <p className="text-sm text-text-secondary max-w-md mt-1 mb-4">
              To receive monthly 20% stream revenue commission wires, please register your corporate bank account details.
            </p>
            <Button variant="primary" onClick={() => setIsModalOpen(true)} icon={<PlusCircle className="h-4 w-4" />}>
              Configure Settlement Account
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Disbursements Table */}
      {disbursements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Wire Disbursements</CardTitle>
            <CardDescription>Cleared Corporate Treasury wire transfers and remittance references.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-muted border-b border-border bg-surface-muted/30">
                  <tr>
                    <th className="py-2.5 px-3">Disbursement Date</th>
                    <th className="py-2.5 px-3">Period</th>
                    <th className="py-2.5 px-3">Amount Cleared</th>
                    <th className="py-2.5 px-3">Treasury Wire Reference</th>
                    <th className="py-2.5 px-3">Destination Account</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {disbursements.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-muted/20">
                      <td className="py-3 px-3 font-medium text-text-primary">{item.settlementDate}</td>
                      <td className="py-3 px-3 text-text-secondary">{item.period}</td>
                      <td className="py-3 px-3 font-bold text-text-primary">{formatCurrency(item.amount)}</td>
                      <td className="py-3 px-3 font-mono text-xs text-brand">{item.wireReference}</td>
                      <td className="py-3 px-3 font-mono text-xs text-text-muted">{item.accountNumberMasked}</td>
                      <td className="py-3 px-3">
                        <StatusBadge status="PAID" customLabel="Cleared" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit / Register Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-text-primary">
                  {isConfigured ? "Update Settlement Account" : "Register Corporate Bank"}
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Enter official corporate bank details for monthly commission wires.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-text-primary transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitAccount} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Bank Institution Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JPMorgan Chase Bank, N.A."
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Corporate Account Holder Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Media Agency LLC"
                  value={formData.account_holder_name}
                  onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Account Number / IBAN *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Account number or IBAN"
                    value={formData.account_number}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    className="w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-text-primary font-mono focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    SWIFT / BIC Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CHASUS33XXX"
                    value={formData.swift_bic}
                    onChange={(e) => setFormData({ ...formData, swift_bic: e.target.value.toUpperCase() })}
                    className="w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-text-primary font-mono uppercase focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Routing / Sort Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Routing or branch code"
                    value={formData.routing_number}
                    onChange={(e) => setFormData({ ...formData, routing_number: e.target.value })}
                    className="w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-text-primary font-mono focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Settlement Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-brand"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED (د.إ)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-border mt-4">
                <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </span>
                  ) : (
                    "Save Settlement Account"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

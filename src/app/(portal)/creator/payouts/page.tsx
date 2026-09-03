"use client";

import { useState } from "react";
import { Wallet, DollarSign, ArrowUpRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/status-badge";
import { DataTable, Column } from "@/components/tables/data-table";
import { creatorService } from "@/features/creator/services/creator.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { creatorPayoutsMock, creatorDashboardMock } from "@/mocks/creator-full.mock";
import { formatCurrency } from "@/lib/formatting";
import type { CreatorPayoutItem } from "@/types/creator";

export default function CreatorPayoutsPage() {
  const { data: payouts, isLoading } = useAsyncData(
    () => creatorService.getPayouts(),
    [],
    400
  );

  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  const dataList = payouts || creatorPayoutsMock;

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setPayoutSuccess(true);
      setTimeout(() => {
        setPayoutSuccess(false);
        setShowPayoutModal(false);
      }, 2000);
    }, 800);
  };

  const columns: Column<CreatorPayoutItem>[] = [
    { key: "id", header: "Payout ID", render: (item) => <span className="font-mono text-xs font-semibold text-text-primary">{item.id}</span> },
    { key: "date", header: "Disbursement Date" },
    {
      key: "amount",
      header: "Amount",
      render: (item) => <span className="font-bold text-text-primary">{formatCurrency(item.amount)}</span>,
    },
    { key: "method", header: "Payment Method" },
    { key: "destination", header: "Destination" },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Payout Receipts & Withdrawals
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Manage your payout methods and request disbursements of confirmed stream earnings.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowPayoutModal(true)} icon={<DollarSign className="h-4 w-4" />}>
          Request Payout ($3,480.00)
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Available Balance"
          value={formatCurrency(creatorDashboardMock.availableEarnings)}
          detail="Cleared for immediate transfer"
          icon={<Wallet className="h-5 w-5" />}
        />
        <StatCard
          label="Last Payout Disbursed"
          value="$3,670.00"
          detail="Paid via PayPal on Aug 15"
          trend={{ value: "Successful", positive: true }}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Payout Method"
          value="PayPal"
          detail="alex.rivera.payouts@example.com"
          icon={<ShieldCheck className="h-5 w-5" />}
        />
      </div>

      {/* Payout History DataTable */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-text-primary">Payout Transaction Receipts</h2>
        <DataTable
          columns={columns}
          data={dataList}
          isLoading={isLoading}
          searchKey="id"
          searchPlaceholder="Search payout receipt ID..."
        />
      </div>

      {/* Request Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-modal border border-border space-y-4">
            <h3 className="text-lg font-bold text-text-primary">Request Earnings Payout</h3>
            <p className="text-xs text-text-secondary">
              Transfer available balance of <strong className="text-brand">$3,480.00 USD</strong> to your verified PayPal account.
            </p>

            {payoutSuccess ? (
              <div className="rounded-xl border border-success/30 bg-success-soft p-4 text-center text-sm font-medium text-success">
                <CheckCircle2 className="mx-auto h-8 w-8 mb-2" />
                <span>Payout request submitted to settlement server!</span>
              </div>
            ) : (
              <form onSubmit={handleRequestPayout} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-text-secondary">Withdrawal Amount ($)</label>
                  <input
                    type="number"
                    defaultValue="3480.00"
                    step="0.01"
                    className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-bold text-text-primary outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-secondary">Payout Destination</label>
                  <input
                    type="text"
                    readOnly
                    value="PayPal: alex.rivera.payouts@example.com"
                    className="w-full mt-1 rounded-lg border border-border bg-surface-muted px-3 py-2 text-xs font-mono text-text-primary outline-none"
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <Button type="button" variant="secondary" className="w-1/2" onClick={() => setShowPayoutModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="w-1/2" isLoading={isSubmitting}>
                    Confirm Payout
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

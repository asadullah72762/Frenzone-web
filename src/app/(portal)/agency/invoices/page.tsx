"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, Download, CheckCircle2, Clock, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/feedback/status-badge";
import { DataTable, Column } from "@/components/tables/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { agencyService } from "@/features/agency/services/agency.service";
import { formatCurrency } from "@/lib/formatting";
import type { AgencyInvoice } from "@/types/agency";
import type { Money } from "@/types/common";

export default function AgencyInvoicesPage() {
  const [invoices, setInvoices] = useState<AgencyInvoice[]>([]);
  const [summary, setSummary] = useState<{
    totalInvoiced: Money;
    totalSettled: Money;
    totalPending: Money;
  }>({
    totalInvoiced: { amount: "0.00", currency: "USD" },
    totalSettled: { amount: "0.00", currency: "USD" },
    totalPending: { amount: "0.00", currency: "USD" },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | "PAID" | "PROCESSING" | "PENDING">("ALL");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await agencyService.getInvoices();
      setInvoices(res.invoices || []);
      if (res.summary) {
        setSummary(res.summary);
      }
    } catch (err: any) {
      console.error("Failed to load invoices:", err);
      setError(err?.message || "Failed to load settlement invoices. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleDownload = async (item: AgencyInvoice) => {
    try {
      setDownloadingId(item.id);
      await agencyService.downloadInvoice(item.id, item.invoiceNumber);
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredInvoices = invoices.filter((item) => {
    if (selectedStatus === "ALL") return true;
    return item.status === selectedStatus;
  });

  const columns: Column<AgencyInvoice>[] = [
    {
      key: "invoiceNumber",
      header: "Invoice & Period",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-mono text-xs font-bold text-text-primary">{item.invoiceNumber}</span>
          <span className="text-xs text-text-muted mt-0.5">{item.period || "Monthly Cycle"}</span>
        </div>
      ),
    },
    { key: "issueDate", header: "Issue Date" },
    { key: "dueDate", header: "Settlement Due" },
    {
      key: "amount",
      header: "Commission Amount",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-bold text-text-primary">{formatCurrency(item.amount)}</span>
          <span className="text-[11px] text-text-muted">20% net agency cut</span>
        </div>
      ),
    },
    {
      key: "wireReference",
      header: "Treasury Wire Ref",
      render: (item) => (
        item.wireReference ? (
          <span className="font-mono text-xs text-brand font-medium bg-brand/5 px-2 py-0.5 rounded">
            {item.wireReference}
          </span>
        ) : (
          <span className="text-xs text-text-muted">Awaiting Wire</span>
        )
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Agency Invoices & Billing History
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Authoritative monthly settlement statements and Corporate Treasury wire disbursement history.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={fetchInvoices}
          disabled={isLoading}
          icon={<RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />}
        >
          Refresh Statements
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Invoiced to Date"
          value={formatCurrency(summary.totalInvoiced)}
          detail="All-time gross 20% commission billed"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="Cleared Wire Settlements"
          value={formatCurrency(summary.totalSettled)}
          detail="Funds disbursed to corporate bank"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
        <StatCard
          label="Pending Clearance"
          value={formatCurrency(summary.totalPending)}
          detail="Scheduled for 15th-of-month wire"
          icon={<Clock className="h-5 w-5 text-amber-500" />}
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center justify-between text-sm text-red-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="secondary" size="sm" onClick={fetchInvoices}>
            Retry
          </Button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 overflow-x-auto">
        {(["ALL", "PAID", "PROCESSING", "PENDING"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedStatus === status
                ? "bg-brand text-white shadow-sm"
                : "bg-surface-muted/60 text-text-secondary hover:bg-surface-muted hover:text-text-primary"
            }`}
          >
            {status === "ALL" ? "All Invoices" : status}
          </button>
        ))}
      </div>

      {/* Data Table */}
      {isLoading && invoices.length === 0 ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredInvoices}
          isLoading={isLoading}
          searchKey="invoiceNumber"
          searchPlaceholder="Search invoice number or period..."
          actions={(item) => (
            <Button
              variant="secondary"
              size="sm"
              disabled={downloadingId === item.id}
              onClick={() => handleDownload(item)}
              icon={
                downloadingId === item.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )
              }
            >
              {downloadingId === item.id ? "Downloading..." : "Download Statement"}
            </Button>
          )}
        />
      )}
    </div>
  );
}

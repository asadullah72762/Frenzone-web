"use client";

import { FileText, Download, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/status-badge";
import { DataTable, Column } from "@/components/tables/data-table";
import { agencyService } from "@/features/agency/services/agency.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { agencyInvoicesMock } from "@/mocks/agency-full.mock";
import { formatCurrency } from "@/lib/formatting";
import type { AgencyInvoice } from "@/types/agency";

export default function AgencyInvoicesPage() {
  const { data: invoices, isLoading } = useAsyncData(
    () => agencyService.getInvoices(),
    [],
    400
  );

  const dataList = invoices || agencyInvoicesMock;

  const columns: Column<AgencyInvoice>[] = [
    { key: "invoiceNumber", header: "Invoice Number", render: (item) => <span className="font-mono text-xs font-semibold text-text-primary">{item.invoiceNumber}</span> },
    { key: "issueDate", header: "Issue Date" },
    { key: "dueDate", header: "Due Date" },
    {
      key: "amount",
      header: "Invoice Amount",
      render: (item) => <span className="font-bold text-text-primary">{formatCurrency(item.amount)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Agency Invoices & Billing History
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Download monthly settlement invoices and track payout clearance statuses.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={dataList}
        isLoading={isLoading}
        searchKey="invoiceNumber"
        searchPlaceholder="Search invoice number..."
        actions={(item) => (
          <Button variant="secondary" size="sm" icon={<Download className="h-3.5 w-3.5" />}>
            Download PDF
          </Button>
        )}
      />
    </div>
  );
}

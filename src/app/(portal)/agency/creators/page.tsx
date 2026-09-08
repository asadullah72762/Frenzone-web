"use client";

import { useState } from "react";
import { Users, Eye, Search, Filter, ShieldCheck, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/status-badge";
import { DataTable, Column } from "@/components/tables/data-table";
import { agencyService } from "@/features/agency/services/agency.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { formatCurrency } from "@/lib/formatting";
import type { AgencyCreatorItem } from "@/types/agency";

export default function AgencyCreatorsPage() {
  const { data: creators, isLoading } = useAsyncData(
    () => agencyService.getCreators(),
    [],
    400
  );

  const [selectedCreator, setSelectedCreator] = useState<AgencyCreatorItem | null>(null);

  const dataList = creators || [];

  const columns: Column<AgencyCreatorItem>[] = [
    {
      key: "name",
      header: "Creator Name & Handle",
      render: (item) => (
        <div className="flex items-center space-x-3">
          {item.avatarUrl ? (
            <img src={item.avatarUrl} alt={item.name} className="h-9 w-9 rounded-full object-cover border border-border" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand font-semibold text-xs border border-border">
              {(item.name || item.username || "C").slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-text-primary">{item.name}</p>
            <p className="text-xs text-text-muted">@{item.username}</p>
          </div>
        </div>
      ),
    },
    { key: "category", header: "Category" },
    { key: "monthlyLiveHours", header: "Monthly Hours", render: (item) => `${item.monthlyLiveHours}h` },
    {
      key: "complianceRate",
      header: "Compliance",
      render: (item) => <span className="font-semibold text-brand">{item.complianceRate}%</span>,
    },
    {
      key: "monthlyRevenue",
      header: "Monthly Revenue",
      align: "right",
      render: (item) => <span className="font-medium text-text-primary">{formatCurrency(item.monthlyRevenue)}</span>,
    },
    {
      key: "agencyCommission",
      header: "Agency Split (20%)",
      align: "right",
      render: (item) => <span className="font-bold text-success">{formatCurrency(item.agencyCommission)}</span>,
    },
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
            Managed Creator Network Roster
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            View all active, pending, and affiliated creators under your agency agreement.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={dataList}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search creator name or username..."
        actions={(item) => (
          <Button variant="ghost" size="sm" onClick={() => setSelectedCreator(item)} icon={<Eye className="h-3.5 w-3.5" />}>
            View Details
          </Button>
        )}
      />

      {/* Creator Detail Modal */}
      {selectedCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-surface p-6 shadow-modal border border-border space-y-4">
            <div className="flex items-center space-x-4 border-b border-border pb-4">
              {selectedCreator.avatarUrl ? (
                <img
                  src={selectedCreator.avatarUrl}
                  alt={selectedCreator.name}
                  className="h-14 w-14 rounded-full object-cover border-2 border-brand/20 shrink-0"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand font-bold text-lg border-2 border-brand/20 shrink-0">
                  {(selectedCreator.name || selectedCreator.username || "C").slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-text-primary">{selectedCreator.name}</h3>
                <p className="text-xs text-text-muted">@{selectedCreator.username} • Joined {selectedCreator.joinedDate}</p>
                <div className="mt-1">
                  <StatusBadge status={selectedCreator.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-border p-3 bg-surface-muted/40">
                <span className="text-text-muted">Monthly Stream Hours</span>
                <p className="text-base font-bold text-text-primary mt-1">{selectedCreator.monthlyLiveHours} Hours</p>
              </div>

              <div className="rounded-lg border border-border p-3 bg-surface-muted/40">
                <span className="text-text-muted">Compliance Target</span>
                <p className="text-base font-bold text-brand mt-1">{selectedCreator.complianceRate}%</p>
              </div>

              <div className="rounded-lg border border-border p-3 bg-surface-muted/40">
                <span className="text-text-muted">Gross Creator Revenue</span>
                <p className="text-base font-bold text-text-primary mt-1">{formatCurrency(selectedCreator.monthlyRevenue)}</p>
              </div>

              <div className="rounded-lg border border-border p-3 bg-surface-muted/40">
                <span className="text-text-muted">Agency Commission (20%)</span>
                <p className="text-base font-bold text-success mt-1">{formatCurrency(selectedCreator.agencyCommission)}</p>
              </div>
            </div>

            <Button variant="primary" className="w-full" onClick={() => setSelectedCreator(null)}>
              Close Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

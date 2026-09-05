"use client";

import { useState } from "react";
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, RefreshCw, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge } from "@/components/feedback/status-badge";
import { DataTable, Column } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { creatorService } from "@/features/creator/services/creator.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import type { CreatorComplianceItem } from "@/types/creator";

export default function CreatorCompliancePage() {
  const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);

  const { data: compliance, isLoading, error, refetch } = useAsyncData(
    () => creatorService.getCompliance(selectedMonth),
    [selectedMonth],
    200
  );

  const logColumns: Column<CreatorComplianceItem>[] = [
    {
      key: "date",
      header: "Log Date",
      render: (item) => <span className="font-semibold text-text-primary">{item.date}</span>,
    },
    {
      key: "targetHours",
      header: "Target Hours",
      render: (item) => `${item.targetHours}h`,
    },
    {
      key: "achievedHours",
      header: "Achieved Hours",
      render: (item) => `${item.achievedHours}h`,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "notes",
      header: "Notes / Exception",
      render: (item) => item.notes || "-",
    },
  ];

  if (error) {
    return (
      <div className="rounded-xl border border-danger/20 bg-surface p-8 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft text-danger">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">Unable to load compliance data</h3>
          <p className="text-sm text-text-secondary mt-1">
            Failed to retrieve your stream compliance records from the server.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} icon={<RefreshCw className="h-4 w-4" />}>
          Try Again
        </Button>
      </div>
    );
  }

  const data = compliance || {
    overallStatus: "MISSED" as const,
    monthlyTargetHours: 40,
    monthlyCompletedHours: 0,
    compliancePercentage: 0,
    dailyLogs: [],
    rulesChecklist: [
      { id: "rule-1", title: "Minimum 15 Live Stream Days / Month", description: "Broadcast for at least 1 hour across 15 separate calendar days.", isCompliant: false },
      { id: "rule-2", title: "Minimum Monthly Live Hours (40h)", description: "Accumulate 40 or more broadcast hours within the current billing cycle.", isCompliant: false },
      { id: "rule-3", title: "High-Definition Video Quality (1080p)", description: "Maintain stable video stream bitrate and resolution standards.", isCompliant: true },
      { id: "rule-4", title: "Community Guidelines & Safety Compliance", description: "Zero strikes or policy warnings on your active creator account.", isCompliant: true },
    ],
  };

  const hoursRemaining = Math.max(0, Number((data.monthlyTargetHours - data.monthlyCompletedHours).toFixed(1)));
  const formattedMonth = new Date(`${selectedMonth}-01`).toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Compliance & Program Targets
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Maintain your approved creator standing by fulfilling daily live target requirements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2 text-xs text-text-secondary bg-surface-muted px-3 py-1.5 rounded-lg border border-border">
            <Calendar className="h-3.5 w-3.5 text-brand" />
            <span className="font-medium">{formattedMonth}</span>
          </div>
          <StatusBadge status={data.overallStatus} />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Monthly Live Stream Requirements</CardTitle>
              <ShieldCheck className="h-5 w-5 text-brand" />
            </div>
            <CardDescription>
              Target: {data.monthlyTargetHours} hours per month • Completed: {data.monthlyCompletedHours} hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-sm font-medium mb-1.5">
                <span className="text-text-primary">Monthly Target Completion</span>
                <span className="text-brand font-bold">{data.compliancePercentage}%</span>
              </div>
              <ProgressBar value={data.compliancePercentage} />
            </div>

            <div className="rounded-lg bg-surface-muted/60 p-4 border border-border flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-text-secondary">
                {hoursRemaining > 0 ? (
                  <>
                    <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                    <span>{hoursRemaining} hours remaining to complete full monthly qualification tier.</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    <span className="text-success font-medium">Monthly target achieved! Full qualification tier unlocked.</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Policy Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.rulesChecklist.map((rule) => (
              <div key={rule.id} className="flex items-start space-x-2 text-xs">
                {rule.isCompliant ? (
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold text-text-primary">{rule.title}</p>
                  <p className="text-text-muted mt-0.5">{rule.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Daily Stream Logs DataTable */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-brand" />
          <h2 className="text-lg font-bold text-text-primary">Daily Stream Compliance Log</h2>
        </div>
        <DataTable
          columns={logColumns}
          data={data.dailyLogs}
          isLoading={isLoading}
          searchKey="date"
          searchPlaceholder="Search log date..."
        />
      </div>
    </div>
  );
}

"use client";

import { ShieldCheck, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge } from "@/components/feedback/status-badge";
import { DataTable, Column } from "@/components/tables/data-table";
import { creatorService } from "@/features/creator/services/creator.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { creatorComplianceMock } from "@/mocks/creator-full.mock";
import type { CreatorComplianceItem } from "@/types/creator";

export default function CreatorCompliancePage() {
  const { data: compliance, isLoading } = useAsyncData(
    () => creatorService.getCompliance(),
    [],
    400
  );

  const data = compliance || creatorComplianceMock;

  const logColumns: Column<CreatorComplianceItem>[] = [
    { key: "date", header: "Log Date", render: (item) => <span className="font-semibold text-text-primary">{item.date}</span> },
    { key: "targetHours", header: "Target Hours", render: (item) => `${item.targetHours}h` },
    { key: "achievedHours", header: "Achieved Hours", render: (item) => `${item.achievedHours}h` },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    { key: "notes", header: "Notes / Exception", render: (item) => item.notes || "-" },
  ];

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
        <StatusBadge status={data.overallStatus} />
      </div>

      {/* Overview Card */}
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
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span>18 hours remaining to complete full monthly qualification tier.</span>
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
                <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
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

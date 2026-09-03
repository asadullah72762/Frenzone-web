"use client";

import { useState } from "react";
import { LifeBuoy, Send, MessageSquare, HelpCircle, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/status-badge";
import { DataTable, Column } from "@/components/tables/data-table";
import { creatorService } from "@/features/creator/services/creator.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { creatorSupportTicketsMock } from "@/mocks/creator-full.mock";
import type { SupportTicket } from "@/types/creator";

export default function CreatorSupportPage() {
  const { data: tickets, isLoading, refetch } = useAsyncData(
    () => creatorService.getSupportTickets(),
    [],
    400
  );

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Technical");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const dataList = tickets || creatorSupportTicketsMock;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    setIsSubmitting(true);

    await creatorService.createSupportTicket(subject, category);
    setIsSubmitting(false);
    setSuccess(true);
    setSubject("");
    setMessage("");
    refetch();

    setTimeout(() => setSuccess(false), 3000);
  };

  const columns: Column<SupportTicket>[] = [
    { key: "id", header: "Ticket ID", render: (item) => <span className="font-mono text-xs font-semibold text-text-primary">{item.id}</span> },
    { key: "subject", header: "Subject", render: (item) => <span className="font-medium text-text-primary">{item.subject}</span> },
    { key: "category", header: "Category" },
    { key: "createdAt", header: "Created Date" },
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
          Creator Helpdesk & Support Desk
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Submit technical or payout inquiries to our 24/7 Creator Support team.
        </p>
      </div>

      {success && (
        <div className="rounded-xl border border-success/30 bg-success-soft p-4 text-sm font-medium text-success flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Ticket submitted! A support agent will respond shortly.</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ticket Submission Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <LifeBuoy className="h-5 w-5 text-brand" />
              <CardTitle>Submit Support Ticket</CardTitle>
            </div>
            <CardDescription>
              We typically respond within 2 to 4 business hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-secondary">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand cursor-pointer"
                >
                  <option value="Technical">Technical & OBS Setup</option>
                  <option value="Payouts">Payouts & Financials</option>
                  <option value="Compliance">Compliance & Targets</option>
                  <option value="General">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary of inquiry..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary">Message Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide details..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand resize-none"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting} icon={<Send className="h-4 w-4" />}>
                Submit Support Request
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tickets DataTable */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-brand" />
            <h2 className="text-lg font-bold text-text-primary">Your Support History</h2>
          </div>
          <DataTable
            columns={columns}
            data={dataList}
            isLoading={isLoading}
            searchKey="subject"
            searchPlaceholder="Search tickets..."
          />
        </div>
      </div>
    </div>
  );
}

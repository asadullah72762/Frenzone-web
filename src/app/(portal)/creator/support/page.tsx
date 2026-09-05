"use client";

import { useState, useEffect, useRef } from "react";
import {
  LifeBuoy,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowLeft,
  Check,
  Clock,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/status-badge";
import { DataTable, Column } from "@/components/tables/data-table";
import { creatorService } from "@/features/creator/services/creator.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import type { SupportTicket, SupportTicketMessage } from "@/types/creator";

export default function CreatorSupportPage() {
  const { data: tickets, isLoading, error, refetch } = useAsyncData(
    () => creatorService.getSupportTickets(),
    [],
    200
  );

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Technical");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Active ticket conversation thread state
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch full ticket details and message thread
  const loadTicketThread = async (ticketId: string, silent = false) => {
    if (!silent) setIsLoadingThread(true);
    try {
      const ticket = await creatorService.getTicketDetails(ticketId);
      setActiveTicket(ticket);
    } catch (err) {
      console.error("Failed to load ticket thread:", err);
    } finally {
      if (!silent) setIsLoadingThread(false);
    }
  };

  // Open ticket thread when selected
  useEffect(() => {
    if (selectedTicketId) {
      loadTicketThread(selectedTicketId);
    } else {
      setActiveTicket(null);
    }
  }, [selectedTicketId]);

  // Real-time synchronization: poll for new support replies every 3.5 seconds
  useEffect(() => {
    if (!selectedTicketId) return;

    const interval = setInterval(() => {
      loadTicketThread(selectedTicketId, true);
    }, 3500);

    return () => clearInterval(interval);
  }, [selectedTicketId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (activeTicket?.messages) {
      scrollToBottom();
    }
  }, [activeTicket?.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const created = await creatorService.createSupportTicket(subject, category, message);
      setIsSubmitting(false);
      setSuccess(true);
      setSubject("");
      setMessage("");
      refetch();
      // Auto open newly created ticket chat
      setSelectedTicketId(created.id);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError(err?.message || "Failed to submit support ticket. Please try again.");
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicketId || isSendingReply) return;

    const textToSend = replyMessage.trim();
    setReplyMessage("");
    setIsSendingReply(true);

    try {
      await creatorService.sendTicketMessage(selectedTicketId, textToSend);
      // Immediately reload updated message thread
      await loadTicketThread(selectedTicketId, true);
      refetch();
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleResolveTicket = async () => {
    if (!selectedTicketId || isResolving) return;
    setIsResolving(true);
    try {
      await creatorService.closeTicket(selectedTicketId);
      await loadTicketThread(selectedTicketId, true);
      refetch();
    } catch (err) {
      console.error("Failed to resolve ticket:", err);
    } finally {
      setIsResolving(false);
    }
  };

  const columns: Column<SupportTicket>[] = [
    {
      key: "id",
      header: "Ticket ID",
      render: (item) => (
        <button
          onClick={() => setSelectedTicketId(item.id)}
          className="font-mono text-xs font-semibold text-brand hover:underline cursor-pointer"
        >
          {item.id}
        </button>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      render: (item) => (
        <button
          onClick={() => setSelectedTicketId(item.id)}
          className="text-left font-medium text-text-primary hover:text-brand transition-colors cursor-pointer"
        >
          {item.subject}
        </button>
      ),
    },
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
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Creator Helpdesk & Support Desk
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Submit technical, payout, or compliance inquiries with real-time support messaging.
          </p>
        </div>
        {tickets && tickets.length > 0 && (
          <div className="text-xs font-semibold text-text-secondary bg-surface-muted px-3 py-1.5 rounded-lg border border-border">
            Total Tickets: <span className="text-text-primary font-bold">{tickets.length}</span>
          </div>
        )}
      </div>

      {success && (
        <div className="rounded-xl border border-success/30 bg-success-soft p-4 text-sm font-medium text-success flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Ticket submitted! Live conversation thread opened below.</span>
        </div>
      )}

      {submitError && (
        <div className="rounded-xl border border-danger/30 bg-danger-soft p-4 text-sm font-medium text-danger flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Active Conversation Drawer/Panel */}
      {selectedTicketId && (
        <Card className="border-brand/40 shadow-lg bg-surface transition-all">
          <CardHeader className="border-b border-border pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedTicketId(null)}
                  icon={<ArrowLeft className="h-4 w-4" />}
                >
                  Back
                </Button>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-brand bg-brand-soft px-2 py-0.5 rounded">
                      {activeTicket?.ticketNumber || activeTicket?.id || selectedTicketId}
                    </span>
                    <h2 className="text-base font-bold text-text-primary">
                      {activeTicket?.subject || "Loading Ticket..."}
                    </h2>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Category: <span className="text-text-primary font-medium">{activeTicket?.category}</span>
                    {activeTicket?.createdAt && ` • Created ${new Date(activeTicket.createdAt).toLocaleDateString()}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {activeTicket?.status && <StatusBadge status={activeTicket.status} />}
                {activeTicket?.status !== "RESOLVED" && activeTicket?.status !== "CLOSED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    isLoading={isResolving}
                    onClick={handleResolveTicket}
                    icon={<Check className="h-3.5 w-3.5 text-success" />}
                  >
                    Mark Resolved
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedTicketId(null)}
                  icon={<X className="h-4 w-4" />}
                >
                  Close
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            {/* Messages Thread Container */}
            <div className="min-h-[260px] max-h-[420px] overflow-y-auto space-y-3 p-3 rounded-lg bg-surface-muted/50 border border-border">
              {isLoadingThread && !activeTicket?.messages ? (
                <div className="flex flex-col items-center justify-center h-48 space-y-2 text-text-secondary">
                  <RefreshCw className="h-6 w-6 animate-spin text-brand" />
                  <span className="text-xs">Loading live conversation thread...</span>
                </div>
              ) : activeTicket?.messages && activeTicket.messages.length > 0 ? (
                activeTicket.messages.map((m, index) => {
                  const isCreator = m.senderRole === "CREATOR";
                  return (
                    <div
                      key={m.id || index}
                      className={`flex flex-col ${isCreator ? "items-end" : "items-start"} space-y-1`}
                    >
                      <div className="flex items-center space-x-1.5 text-[11px] text-text-secondary">
                        {!isCreator ? (
                          <>
                            <UserCheck className="h-3 w-3 text-brand" />
                            <span className="font-semibold text-brand">Frenzone Support</span>
                          </>
                        ) : (
                          <span className="font-medium text-text-primary">You</span>
                        )}
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-2.5 w-2.5" />
                          <span>
                            {m.createdAt
                              ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                              : ""}
                          </span>
                        </span>
                      </div>

                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed max-w-[85%] break-words ${
                          isCreator
                            ? "bg-brand text-white rounded-tr-sm shadow-sm"
                            : "bg-surface text-text-primary rounded-tl-sm border border-border shadow-xs"
                        }`}
                      >
                        {m.message}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-36 text-center text-text-secondary">
                  <MessageSquare className="h-8 w-8 text-text-muted mb-2" />
                  <p className="text-xs">No messages yet in this ticket.</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Real-time Message Reply Input */}
            {activeTicket?.status !== "CLOSED" ? (
              <form onSubmit={handleSendReply} className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="Type your reply message..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text-primary outline-none focus:border-brand"
                />
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSendingReply}
                  disabled={!replyMessage.trim()}
                  icon={<Send className="h-4 w-4" />}
                >
                  Send
                </Button>
              </form>
            ) : (
              <div className="rounded-lg bg-surface-muted p-3 text-center text-xs text-text-secondary border border-border">
                This ticket is closed and archived. Submit a new ticket if you require further assistance.
              </div>
            )}
          </CardContent>
        </Card>
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
                  placeholder="Provide detailed description of your issue..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isSubmitting}
                icon={<Send className="h-4 w-4" />}
              >
                Submit Support Request
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tickets DataTable */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-brand" />
              <h2 className="text-lg font-bold text-text-primary">Your Support History</h2>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => refetch()}
              icon={<RefreshCw className="h-3.5 w-3.5" />}
            >
              Refresh
            </Button>
          </div>

          <DataTable
            columns={columns}
            data={tickets || []}
            isLoading={isLoading}
            searchKey="subject"
            searchPlaceholder="Search tickets..."
            actions={(item) => (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedTicketId(item.id)}
                icon={<MessageSquare className="h-3.5 w-3.5 text-brand" />}
              >
                Chat
              </Button>
            )}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { UserPlus, Send, Mail, CheckCircle2, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/status-badge";
import { DataTable, Column } from "@/components/tables/data-table";
import { agencyService } from "@/features/agency/services/agency.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import type { AgencyInvitation } from "@/types/agency";

export default function AgencyInvitationsPage() {
  const { data: invitations, isLoading, refetch } = useAsyncData(
    () => agencyService.getInvitations(),
    [],
    400
  );

  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [inviteError, setInviteError] = useState<string>();

  const dataList = invitations || [];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() && !email.trim()) return;
    setIsSending(true);
    setInviteError(undefined);

    try {
      await agencyService.sendInvitation(username.trim(), email.trim());
      setIsSending(false);
      setSuccess(true);
      setUsername("");
      setEmail("");
      refetch();

      setTimeout(() => {
        setSuccess(false);
        setShowModal(false);
      }, 1500);
    } catch (err: any) {
      setIsSending(false);
      setInviteError(err.message || "Failed to send invitation. Please verify the username or email.");
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this invitation?")) return;
    try {
      await agencyService.cancelInvitation(id);
      refetch();
    } catch (err: any) {
      alert(err.message || "Failed to revoke invitation");
    }
  };

  const columns: Column<AgencyInvitation>[] = [
    { key: "id", header: "Invite ID", render: (item) => <span className="font-mono text-xs font-semibold text-text-primary">{item.id.slice(-6).toUpperCase()}</span> },
    { key: "creatorUsername", header: "Creator Handle", render: (item) => <span className="font-bold text-text-primary">@{item.creatorUsername}</span> },
    { key: "creatorEmail", header: "Email Address" },
    { key: "sentDate", header: "Sent Date" },
    { key: "expiresDate", header: "Expires Date" },
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
            Creator Agency Invitations
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Invite non-affiliated creators to join your agency roster on Frenzone.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)} icon={<UserPlus className="h-4 w-4" />}>
          Invite New Creator
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={dataList}
        isLoading={isLoading}
        searchKey="creatorUsername"
        searchPlaceholder="Search creator handle..."
        actions={(item) =>
          item.status === "PENDING_CONSENT" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCancel(item.id)}
              className="text-danger hover:text-danger text-xs font-semibold"
            >
              Revoke
            </Button>
          ) : null
        }
      />

      {/* Invite Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-modal border border-border space-y-4">
            <h3 className="text-lg font-bold text-text-primary">Send Agency Invitation</h3>
            <p className="text-xs text-text-secondary">
              The creator will receive an official consent request in their Frenzone portal.
            </p>

            {success ? (
              <div className="rounded-xl border border-success/30 bg-success-soft p-4 text-center text-sm font-medium text-success">
                <CheckCircle2 className="mx-auto h-8 w-8 mb-2" />
                <span>Invitation sent successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-4 pt-2">
                {inviteError && (
                  <div className="rounded-lg bg-red-50 p-2.5 border border-red-200 text-xs text-danger font-medium">
                    {inviteError}
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-text-secondary">Creator Frenzone Username</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. alex_vibe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-secondary">Creator Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. creator@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <Button type="button" variant="secondary" className="w-1/2" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="w-1/2" isLoading={isSending} icon={<Send className="h-4 w-4" />}>
                    Send Invitation
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

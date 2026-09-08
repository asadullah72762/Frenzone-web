"use client";

import { useState, useEffect } from "react";
import { UserPlus, Send, Mail, CheckCircle2, Clock, Search, AlertCircle, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/status-badge";
import { DataTable, Column } from "@/components/tables/data-table";
import { agencyService } from "@/features/agency/services/agency.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import type { AgencyInvitation, CreatorSearchResult } from "@/types/agency";

export default function AgencyInvitationsPage() {
  const { data: invitations, isLoading, refetch } = useAsyncData(
    () => agencyService.getInvitations(),
    [],
    400
  );

  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CreatorSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<CreatorSearchResult | null>(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [inviteError, setInviteError] = useState<string>();

  // Debounced creator search effect (300ms)
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // If the query matches the currently selected creator's username, don't re-search
    if (selectedCreator && selectedCreator.username === searchQuery.trim()) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await agencyService.searchCreators(searchQuery.trim());
        setSearchResults(res.creators || []);
      } catch (err) {
        console.error("Creator search error:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCreator]);

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
      setSearchQuery("");
      setSelectedCreator(null);
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
                  <div className="rounded-lg bg-red-50 p-2.5 border border-red-200 text-xs text-danger font-medium flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{inviteError}</span>
                  </div>
                )}

                {/* Creator Live Search Autocomplete */}
                <div className="relative">
                  <label className="text-xs font-semibold text-text-secondary">Search Registered Creators</label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Type username, name, or email..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSelectedCreator(null);
                      }}
                      className="w-full rounded-lg border border-border bg-surface pl-9 pr-8 py-2 text-sm text-text-primary outline-none focus:border-brand"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                      </div>
                    )}
                  </div>

                  {/* Suggestions Dropdown */}
                  {searchQuery.trim().length >= 2 && !selectedCreator && (
                    <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-border bg-surface shadow-modal divide-y divide-border-subtle">
                      {searchResults.length === 0 && !isSearching ? (
                        <div className="p-3 text-center text-xs text-text-muted">
                          No registered creators found matching "{searchQuery}"
                        </div>
                      ) : (
                        searchResults.map((cr) => (
                          <button
                            key={cr.id}
                            type="button"
                            onClick={() => {
                              setSelectedCreator(cr);
                              setUsername(cr.username);
                              setEmail(cr.email);
                              setSearchQuery(cr.username);
                            }}
                            className="w-full flex items-center justify-between p-2.5 hover:bg-surface-muted transition-colors text-left"
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              {cr.avatarUrl ? (
                                <img src={cr.avatarUrl} alt={cr.name} className="h-8 w-8 rounded-full object-cover border border-brand/20 shrink-0" />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs shrink-0">
                                  {cr.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div className="truncate">
                                <p className="text-xs font-bold text-text-primary truncate">{cr.name}</p>
                                <p className="text-[11px] text-text-muted truncate">@{cr.username}</p>
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                              cr.canInvite
                                ? "bg-success-soft text-success border border-success/30"
                                : cr.relationshipStatus === "pending_consent"
                                ? "bg-warning-soft text-warning border border-warning/30"
                                : "bg-surface-muted text-text-muted border border-border"
                            }`}>
                              {cr.canInvite ? "Can Invite" : cr.relationshipStatus === "pending_consent" ? "Already Invited" : cr.relationshipStatus === "connected" ? "Connected" : "Unavailable"}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Creator Banner */}
                {selectedCreator && (
                  <div className={`rounded-xl p-3 border text-xs flex items-center justify-between animate-in fade-in ${
                    selectedCreator.canInvite
                      ? "bg-brand-soft/40 border-brand/30"
                      : "bg-warning-soft/30 border-warning/30"
                  }`}>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${selectedCreator.canInvite ? "text-brand" : "text-warning"}`} />
                      <div>
                        <p className="font-bold text-text-primary">@{selectedCreator.username} ({selectedCreator.name})</p>
                        <p className="text-[11px] text-text-muted">{selectedCreator.email || "No email on file"}</p>
                      </div>
                    </div>
                    {!selectedCreator.canInvite && (
                      <span className="text-[10px] font-bold text-warning uppercase tracking-wider">
                        {selectedCreator.relationshipStatus === "pending_consent" ? "Pending" : "Affiliated"}
                      </span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-text-secondary">Username Handle</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. alex_vibe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text-primary outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-text-secondary">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="creator@frenzone.live"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text-primary outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <Button type="button" variant="secondary" className="w-1/2" onClick={() => {
                    setShowModal(false);
                    setSelectedCreator(null);
                    setSearchQuery("");
                  }}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-1/2"
                    isLoading={isSending}
                    disabled={Boolean(selectedCreator && !selectedCreator.canInvite)}
                    icon={<Send className="h-4 w-4" />}
                  >
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

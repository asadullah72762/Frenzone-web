"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, ShieldAlert, Clock, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveAccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
  message?: string;
}

export const LiveAccessDeniedModal: React.FC<LiveAccessDeniedModalProps> = ({
  isOpen,
  onClose,
  reason = "not_eligible",
  message,
}) => {
  if (!isOpen) return null;

  const getContent = () => {
    switch (reason) {
      case "application_pending":
        return {
          icon: <Clock className="h-6 w-6 text-amber-500" />,
          title: "Creator Application Pending",
          description:
            message ||
            "Your creator application is currently being reviewed by our compliance team. Live Studio broadcasting will automatically unlock once approved.",
          primaryAction: {
            label: "View Application",
            href: "/creator/application",
          },
          secondaryAction: {
            label: "Review Compliance",
            href: "/creator/compliance",
          },
        };
      case "creator_suspended":
      case "banned":
        return {
          icon: <ShieldAlert className="h-6 w-6 text-rose-500" />,
          title: "Broadcasting Privileges Suspended",
          description:
            message ||
            "Your broadcasting privileges have been suspended due to account or safety guidelines review. Please contact creator support for details.",
          primaryAction: {
            label: "Contact Support",
            href: "/creator/support",
          },
          secondaryAction: {
            label: "Community Rules",
            href: "/creator/compliance",
          },
        };
      case "live_access_revoked":
        return {
          icon: <ShieldAlert className="h-6 w-6 text-rose-500" />,
          title: "Live Access Restricted",
          description:
            message ||
            "Live streaming access is disabled for this account by platform administration.",
          primaryAction: {
            label: "Submit Appeal",
            href: "/creator/support",
          },
          secondaryAction: {
            label: "Guidelines",
            href: "/creator/compliance",
          },
        };
      case "application_rejected":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
          title: "Application Not Approved",
          description:
            message ||
            "Your creator application was not approved. Please review the program requirements before submitting an update.",
          primaryAction: {
            label: "Program Requirements",
            href: "/creator/compliance",
          },
          secondaryAction: {
            label: "Support",
            href: "/creator/support",
          },
        };
      case "session_conflict":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-brand" />,
          title: "Active Broadcast In Progress",
          description:
            message ||
            "You already have an active broadcast session running on another device or tab.",
          primaryAction: {
            label: "Go to Studio",
            href: "/creator/studio",
          },
          secondaryAction: {
            label: "Dismiss",
            onClick: onClose,
          },
        };
      default:
        return {
          icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
          title: "Live Studio Access Required",
          description:
            message ||
            "To go live from the browser studio, your account must have an approved Creator application, verified badge, or at least 1,000 followers.",
          primaryAction: {
            label: "Eligibility & Compliance",
            href: "/creator/compliance",
          },
          secondaryAction: {
            label: "Creator Application",
            href: "/creator/application",
          },
        };
    }
  };

  const content = getContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-modal border border-border text-left space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted border border-border">
              {content.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">{content.title}</h3>
              <p className="text-xs text-text-secondary">Studio Access Control</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1 cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed">
          {content.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-2 pt-3">
          {content.secondaryAction && (
            content.secondaryAction.href ? (
              <Link href={content.secondaryAction.href} className="flex-1" onClick={onClose}>
                <Button variant="secondary" className="w-full text-xs">
                  {content.secondaryAction.label}
                </Button>
              </Link>
            ) : (
              <Button
                variant="secondary"
                className="flex-1 text-xs"
                onClick={content.secondaryAction.onClick || onClose}
              >
                {content.secondaryAction.label}
              </Button>
            )
          )}

          {content.primaryAction.href ? (
            <Link href={content.primaryAction.href} className="flex-1" onClick={onClose}>
              <Button variant="primary" className="w-full text-xs">
                {content.primaryAction.label}
              </Button>
            </Link>
          ) : (
            <Button variant="primary" className="flex-1 text-xs" onClick={onClose}>
              {content.primaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

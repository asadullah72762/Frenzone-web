"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Check, Download, Share2, X, AlertCircle, RefreshCw, Sparkles, ShieldCheck } from "lucide-react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { referralService, type ReferralCodeResponse } from "@/features/referrals/services/referral.service";
import { getCanonicalReferralUrl } from "@/lib/referral/referral-url";

interface ShareQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  initialLink?: string;
}

export function ShareQrModal({
  isOpen,
  onClose,
  initialCode,
  initialLink,
}: ShareQrModalProps) {
  const [data, setData] = useState<ReferralCodeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(!initialCode);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fetch or sync server-authoritative referral info
  const fetchReferralData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await referralService.getCode();
      if (res.success && res.referralCode) {
        const canonicalUrl = getCanonicalReferralUrl(res.referralCode, res.referralUrl || res.referralLink);
        setData({
          ...res,
          referralUrl: canonicalUrl,
          referralLink: canonicalUrl,
        });
      } else {
        throw new Error("Unable to retrieve referral code from server.");
      }
    } catch (err: any) {
      if (initialCode) {
        // Fallback to initial props if network transient
        const canonicalUrl = getCanonicalReferralUrl(initialCode, initialLink);
        setData({
          success: true,
          referralCode: initialCode,
          referralUrl: canonicalUrl,
          referralLink: canonicalUrl,
        });
      } else {
        setError(err.message || "Failed to load referral details. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (!initialCode) {
        fetchReferralData();
      } else {
        const canonicalUrl = getCanonicalReferralUrl(initialCode, initialLink);
        setData({
          success: true,
          referralCode: initialCode,
          referralUrl: canonicalUrl,
          referralLink: canonicalUrl,
        });
        setIsLoading(false);
      }
    } else {
      setCopied(false);
      setShareFeedback(null);
    }
  }, [isOpen, initialCode, initialLink]);

  // Guaranteed canonical environment-aware URL used identically by both Copy Link and QR Code
  const activeUrl = getCanonicalReferralUrl(
    data?.referralCode || initialCode,
    data?.referralUrl || data?.referralLink || initialLink
  );

  useEffect(() => {
    if (isOpen && activeUrl && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, activeUrl, {
        errorCorrectionLevel: "H",
        width: 200,
        margin: 2,
        color: {
          dark: "#0f172a", // Deep slate for maximum contrast and reliability
          light: "#ffffff",
        },
      }).catch((err) => {
        console.error("Canvas QR Code generation error:", err);
      });
    }
  }, [isOpen, activeUrl]);

  // Handle keyboard Escape to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Action 1: Copy Canonical Referral Link
  const handleCopyLink = async () => {
    if (!activeUrl) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(activeUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = activeUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Action 2: Download High-Resolution QR PNG Image
  const handleDownloadQr = async () => {
    if (!activeUrl || !data?.referralCode) return;
    try {
      // Generate crisp 1024x1024 printable QR code
      const highResDataUrl = await QRCode.toDataURL(activeUrl, {
        errorCorrectionLevel: "H",
        width: 1024,
        margin: 3,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      });

      const downloadAnchor = document.createElement("a");
      downloadAnchor.href = highResDataUrl;
      downloadAnchor.download = `frenzone-creator-referral-${data.referralCode}.png`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
    } catch (err) {
      console.error("Failed to download high-res QR code:", err);
    }
  };

  // Action 3: Native Web Share API with Clipboard Fallback
  const handleShare = async () => {
    if (!activeUrl) return;
    const shareData = {
      title: "Join Frenzone with my Creator Invite",
      text: `Join me on Frenzone, the premier live streaming community! Register free using my invite code: ${data?.referralCode || ""}`,
      url: activeUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          handleCopyLink();
          setShareFeedback("Link copied to clipboard!");
          setTimeout(() => setShareFeedback(null), 2500);
        }
      }
    } else {
      handleCopyLink();
      setShareFeedback("Link copied to clipboard!");
      setTimeout(() => setShareFeedback(null), 2500);
    }
  };

  const displayName = data?.displayName || "Creator Invite";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "CR";

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
    >
      <div
        className="relative w-full max-w-md my-auto rounded-2xl bg-surface shadow-2xl border border-border flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3.5rem)] text-center overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (Pinned) */}
        <div className="relative px-5 sm:px-6 pt-5 pb-3 border-b border-border/50 shrink-0 text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="inline-flex items-center space-x-1.5 rounded-full bg-brand-soft px-3 py-0.5 text-[11px] font-bold text-brand border border-brand/20 mb-1.5">
            <Sparkles className="h-3 w-3" />
            <span>Frenzone Verified Creator</span>
          </div>

          <h2 id="qr-modal-title" className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
            Share Your Referral QR Code
          </h2>
          <p className="text-xs text-text-secondary max-w-xs mx-auto mt-0.5">
            Scan to instantly access your invite and unlock 10% lifetime referral bonus.
          </p>
        </div>

        {/* Modal Body (Scrollable with smooth overscroll) */}
        <div className="overflow-y-auto px-5 sm:px-6 py-4 space-y-3.5 overscroll-contain flex-1">
          {/* Loading State */}
          {isLoading && (
            <div className="py-10 space-y-3">
              <div className="mx-auto h-40 w-40 rounded-2xl bg-surface-muted animate-pulse border border-border flex items-center justify-center">
                <RefreshCw className="h-7 w-7 text-text-muted animate-spin" />
              </div>
              <p className="text-xs text-text-muted animate-pulse">
                Generating your verified referral QR...
              </p>
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="py-6 space-y-3 rounded-xl border border-danger/20 bg-danger/5 p-4">
              <AlertCircle className="mx-auto h-7 w-7 text-danger" />
              <p className="text-xs font-semibold text-danger">{error}</p>
              <Button variant="secondary" size="sm" onClick={fetchReferralData} icon={<RefreshCw className="h-3.5 w-3.5" />}>
                Try Again
              </Button>
            </div>
          )}

          {/* Ready State */}
          {!isLoading && !error && data && (
            <>
              {/* Creator Monogram / Avatar Card */}
              <div className="flex items-center justify-between rounded-xl bg-surface-muted/60 px-3 py-2 border border-border">
                <div className="flex items-center space-x-2.5">
                  {data.avatarUrl ? (
                    <img
                      src={data.avatarUrl}
                      alt={displayName}
                      className="h-8 w-8 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-brand text-white font-bold text-xs flex items-center justify-center">
                      {initials}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-xs font-bold text-text-primary leading-tight">{displayName}</p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      Code: <strong className="font-mono text-brand">{data.referralCode}</strong>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-brand bg-brand-soft/70 px-2 py-0.5 rounded-md border border-brand/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verified</span>
                </div>
              </div>

              {/* High-Precision QR Canvas Container */}
              <div className="mx-auto flex h-48 w-48 sm:h-52 sm:w-52 items-center justify-center rounded-2xl border-2 border-brand/20 bg-white p-2.5 shadow-inner">
                <canvas
                  ref={canvasRef}
                  className="h-44 w-44 sm:h-48 sm:w-48 rounded-xl object-contain"
                  aria-label={`QR Code for referral link ${activeUrl}`}
                />
              </div>

              {/* Canonical Link Display Bar */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Canonical Referral URL
                </label>
                <div className="flex items-center justify-between rounded-xl border border-border bg-surface-muted px-3 py-2 text-xs font-mono text-text-primary">
                  <span className="truncate mr-2 select-all">{activeUrl}</span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="shrink-0 text-brand hover:text-brand-hover font-sans font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                    title="Copy link to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-success" />
                        <span className="text-success text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {shareFeedback && (
                <p className="text-xs font-semibold text-brand animate-in fade-in">
                  {shareFeedback}
                </p>
              )}
            </>
          )}
        </div>

        {/* Modal Footer with Action Buttons (Pinned) */}
        {!isLoading && !error && data && (
          <div className="px-5 sm:px-6 py-3.5 border-t border-border/50 bg-surface/95 backdrop-blur-xs shrink-0">
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCopyLink}
                className="w-full text-xs"
                icon={copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              >
                {copied ? "Copied" : "Copy Link"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDownloadQr}
                className="w-full text-xs"
                icon={<Download className="h-3.5 w-3.5" />}
              >
                Download
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleShare}
                className="w-full text-xs"
                icon={<Share2 className="h-3.5 w-3.5" />}
              >
                Share
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

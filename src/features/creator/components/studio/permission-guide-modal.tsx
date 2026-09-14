"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Camera,
  Mic,
  RefreshCw,
  X,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Lock,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";

interface PermissionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => Promise<any>;
  isRequesting?: boolean;
  cameraStatus?: string;
  microphoneStatus?: string;
  cameraMessage?: string | null;
  microphoneMessage?: string | null;
}

export function PermissionGuideModal({
  isOpen,
  onClose,
  onRetry,
  isRequesting = false,
  cameraStatus,
  microphoneStatus,
  cameraMessage,
  microphoneMessage,
}: PermissionGuideModalProps) {
  const [activeTab, setActiveTab] = useState<"chrome" | "edge" | "safari" | "firefox">("chrome");
  const [testCameraStatus, setTestCameraStatus] = useState<"idle" | "testing" | "passed" | "failed">("idle");
  const [testMicStatus, setTestMicStatus] = useState<"idle" | "testing" | "passed" | "failed">("idle");
  const [testError, setTestError] = useState<string | null>(null);

  if (!isOpen) return null;

  const testSingleDevice = async (kind: "video" | "audio") => {
    setTestError(null);
    if (kind === "video") setTestCameraStatus("testing");
    if (kind === "audio") setTestMicStatus("testing");

    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("Media devices are not supported or blocked (check if HTTPS is enabled).");
      }
      const stream = await navigator.mediaDevices.getUserMedia(
        kind === "video" ? { video: true } : { audio: true }
      );
      // Clean up track immediately
      stream.getTracks().forEach((t) => t.stop());

      if (kind === "video") setTestCameraStatus("passed");
      if (kind === "audio") setTestMicStatus("passed");
    } catch (err: any) {
      console.warn(`Test ${kind} failed:`, err);
      if (kind === "video") setTestCameraStatus("failed");
      if (kind === "audio") setTestMicStatus("failed");
      setTestError(
        err?.name === "NotAllowedError"
          ? `${kind === "video" ? "Camera" : "Microphone"} permission is currently blocked in your browser.`
          : err?.name === "NotFoundError"
          ? `No ${kind === "video" ? "camera" : "microphone"} hardware was detected on this device.`
          : err?.name === "NotReadableError"
          ? `${kind === "video" ? "Camera" : "Microphone"} is in use by another app (e.g. OBS, Zoom, Teams).`
          : err?.message || `Failed to access ${kind}.`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">Camera & Microphone Access</h3>
              <p className="text-xs text-text-secondary">How to allow permissions in your browser</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Current Status Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-surface-muted p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
                  <Camera className="h-4 w-4 text-brand" />
                  Camera
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    cameraStatus === "ready"
                      ? "bg-emerald-500/15 text-emerald-600"
                      : cameraStatus === "blocked"
                      ? "bg-rose-500/15 text-rose-600"
                      : "bg-amber-500/15 text-amber-600"
                  }`}
                >
                  {cameraStatus || "Checking"}
                </span>
              </div>
              <p className="text-[11px] text-text-muted line-clamp-2">
                {cameraMessage || (cameraStatus === "ready" ? "Camera is ready" : "Permission needed")}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface-muted p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
                  <Mic className="h-4 w-4 text-brand" />
                  Microphone
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    microphoneStatus === "ready"
                      ? "bg-emerald-500/15 text-emerald-600"
                      : microphoneStatus === "blocked"
                      ? "bg-rose-500/15 text-rose-600"
                      : "bg-amber-500/15 text-amber-600"
                  }`}
                >
                  {microphoneStatus || "Checking"}
                </span>
              </div>
              <p className="text-[11px] text-text-muted line-clamp-2">
                {microphoneMessage || (microphoneStatus === "ready" ? "Microphone is ready" : "Permission needed")}
              </p>
            </div>
          </div>

          {/* Browser Selection Tabs */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Step-by-Step Browser Instructions
            </label>
            <div className="flex gap-1 rounded-xl bg-surface-muted p-1 border border-border">
              {(["chrome", "edge", "firefox", "safari"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setActiveTab(b)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold capitalize transition-all cursor-pointer ${
                    activeTab === b
                      ? "bg-surface text-brand shadow-sm"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* Browser Specific Instructions */}
            <div className="rounded-xl border border-border/80 bg-surface-muted/50 p-4 text-xs space-y-3">
              {activeTab === "chrome" && (
                <ol className="space-y-2.5 text-text-secondary">
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                      1
                    </span>
                    <span>
                      Look at the left side of the address bar at the top of Chrome, and click the{" "}
                      <strong className="text-text-primary font-semibold">🔒 Lock</strong> or{" "}
                      <strong className="text-text-primary font-semibold">Tune (Sliders)</strong> icon next to the URL.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                      2
                    </span>
                    <span>
                      Find <strong className="text-text-primary font-semibold">Camera</strong> and{" "}
                      <strong className="text-text-primary font-semibold">Microphone</strong> in the popup menu.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                      3
                    </span>
                    <span>
                      Switch both toggles to <strong className="text-emerald-600 font-bold">Allow</strong> (or Reset permissions).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                      4
                    </span>
                    <span>
                      Click the <strong className="text-brand font-bold">Retry Access</strong> button below.
                    </span>
                  </li>
                </ol>
              )}

              {activeTab === "edge" && (
                <ol className="space-y-2.5 text-text-secondary">
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                      1
                    </span>
                    <span>
                      Click the <strong className="text-text-primary font-semibold">🔒 Lock</strong> icon on the left side of Microsoft Edge's address bar.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                      2
                    </span>
                    <span>
                      Click <strong className="text-text-primary font-semibold">Permissions for this site</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                      3
                    </span>
                    <span>
                      Set <strong className="text-text-primary font-semibold">Camera</strong> and{" "}
                      <strong className="text-text-primary font-semibold">Microphone</strong> to{" "}
                      <strong className="text-emerald-600 font-bold">Allow</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                      4
                    </span>
                    <span>Return to this tab and click <strong className="text-brand font-bold">Retry Access</strong>.</span>
                  </li>
                </ol>
              )}

              {activeTab === "firefox" && (
                <ol className="space-y-2.5 text-text-secondary">
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                      1
                    </span>
                    <span>
                      Click the <strong className="text-text-primary font-semibold">Shield / Permissions</strong> icon to the left of the address bar.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                      2
                    </span>
                    <span>
                      Under Permissions, click the <strong className="text-rose-600 font-semibold">✕ (cross)</strong> next to Blocked Camera and Microphone to clear the block.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                      3
                    </span>
                    <span>
                      Click <strong className="text-brand font-bold">Retry Access</strong> below and click <em>Allow</em> when prompted.
                    </span>
                  </li>
                </ol>
              )}

              {activeTab === "safari" && (
                <ol className="space-y-2.5 text-text-secondary">
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                      1
                    </span>
                    <span>
                      In the top macOS menu, click <strong className="text-text-primary font-semibold">Safari</strong> →{" "}
                      <strong className="text-text-primary font-semibold">Settings for This Website...</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                      2
                    </span>
                    <span>
                      Set <strong className="text-text-primary font-semibold">Camera</strong> and{" "}
                      <strong className="text-text-primary font-semibold">Microphone</strong> to{" "}
                      <strong className="text-emerald-600 font-bold">Allow</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                      3
                    </span>
                    <span>Click <strong className="text-brand font-bold">Retry Access</strong> below.</span>
                  </li>
                </ol>
              )}
            </div>
          </div>

          {/* Quick Hardware Diagnostic Tests */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Quick Hardware Tests
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => testSingleDevice("video")}
                disabled={testCameraStatus === "testing"}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-muted px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface transition-colors cursor-pointer disabled:opacity-50"
              >
                <Camera className="h-3.5 w-3.5 text-brand" />
                <span>
                  {testCameraStatus === "testing"
                    ? "Testing Camera..."
                    : testCameraStatus === "passed"
                    ? "Camera Working ✓"
                    : testCameraStatus === "failed"
                    ? "Camera Failed ✕"
                    : "Test Camera Only"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => testSingleDevice("audio")}
                disabled={testMicStatus === "testing"}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-muted px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface transition-colors cursor-pointer disabled:opacity-50"
              >
                <Mic className="h-3.5 w-3.5 text-brand" />
                <span>
                  {testMicStatus === "testing"
                    ? "Testing Mic..."
                    : testMicStatus === "passed"
                    ? "Mic Working ✓"
                    : testMicStatus === "failed"
                    ? "Mic Failed ✕"
                    : "Test Mic Only"}
                </span>
              </button>
            </div>

            {testError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-2.5 text-[11px] font-medium text-rose-600">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{testError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-surface-muted/30">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-text-secondary hover:bg-surface hover:text-text-primary transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={async () => {
              const res = await onRetry();
              if (res) {
                onClose();
              }
            }}
            disabled={isRequesting}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-hover hover:from-brand-hover hover:to-brand-active px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand/20 transition-all cursor-pointer active:scale-95 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${isRequesting ? "animate-spin" : ""}`} />
            <span>{isRequesting ? "Initializing..." : "Retry & Open Camera"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

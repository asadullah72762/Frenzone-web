"use client";

import { Video, Mic, RefreshCw, X } from "lucide-react";

interface DeviceSelectorProps {
  cameras: MediaDeviceInfo[];
  microphones: MediaDeviceInfo[];
  selectedCameraId: string;
  selectedMicrophoneId: string;
  disabled?: boolean;
  variant?: "default" | "glass";
  className?: string;
  onSelectCamera: (deviceId: string) => void;
  onSelectMicrophone: (deviceId: string) => void;
  onRefreshDevices: () => void;
  onClose?: () => void;
}

export function DeviceSelector({
  cameras,
  microphones,
  selectedCameraId,
  selectedMicrophoneId,
  disabled = false,
  variant = "default",
  className = "",
  onSelectCamera,
  onSelectMicrophone,
  onRefreshDevices,
  onClose,
}: DeviceSelectorProps) {
  const isGlass = variant === "glass";

  return (
    <div
      className={
        className ||
        (isGlass
          ? "rounded-2xl border border-white/20 bg-zinc-950/85 backdrop-blur-2xl p-4 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200"
          : "rounded-xl border border-border bg-surface p-4 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150")
      }
    >
      <div
        className={`flex items-center justify-between pb-2.5 border-b mb-3 ${
          isGlass ? "border-white/15" : "border-border"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${isGlass ? "bg-brand animate-pulse" : "bg-brand"}`} />
          <h4 className={`text-xs font-bold ${isGlass ? "text-white" : "text-text-primary"}`}>
            Audio & Video Device Settings
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefreshDevices}
            disabled={disabled}
            className={`flex items-center gap-1 text-[11px] font-bold disabled:opacity-50 transition-colors cursor-pointer ${
              isGlass ? "text-amber-400 hover:text-amber-300" : "text-brand hover:text-brand-hover"
            }`}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Rescan</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={`transition-colors p-1 rounded-lg cursor-pointer ${
                isGlass
                  ? "text-white/60 hover:text-white hover:bg-white/10"
                  : "text-text-muted hover:text-text-primary hover:bg-surface-muted"
              }`}
              title="Close Settings"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Camera Selector */}
        <div className="space-y-1">
          <label
            className={`flex items-center gap-1.5 text-xs font-bold ${
              isGlass ? "text-white/80" : "text-text-secondary"
            }`}
          >
            <Video className="h-3.5 w-3.5 text-brand" />
            <span>Camera Input</span>
          </label>
          <select
            value={selectedCameraId}
            disabled={disabled || cameras.length === 0}
            onChange={(e) => onSelectCamera(e.target.value)}
            className={`w-full rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50 transition-colors cursor-pointer ${
              isGlass
                ? "border border-white/15 bg-zinc-900/90 text-white"
                : "border border-border bg-surface-muted text-text-primary"
            }`}
          >
            {cameras.length === 0 ? (
              <option value="">No cameras detected</option>
            ) : (
              cameras.map((cam, idx) => (
                <option key={cam.deviceId || idx} value={cam.deviceId} className="bg-zinc-900 text-white">
                  {cam.label || `Camera ${idx + 1}`}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Microphone Selector */}
        <div className="space-y-1">
          <label
            className={`flex items-center gap-1.5 text-xs font-bold ${
              isGlass ? "text-white/80" : "text-text-secondary"
            }`}
          >
            <Mic className="h-3.5 w-3.5 text-brand" />
            <span>Microphone Input</span>
          </label>
          <select
            value={selectedMicrophoneId}
            disabled={disabled || microphones.length === 0}
            onChange={(e) => onSelectMicrophone(e.target.value)}
            className={`w-full rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50 transition-colors cursor-pointer ${
              isGlass
                ? "border border-white/15 bg-zinc-900/90 text-white"
                : "border border-border bg-surface-muted text-text-primary"
            }`}
          >
            {microphones.length === 0 ? (
              <option value="">No microphones detected</option>
            ) : (
              microphones.map((mic, idx) => (
                <option key={mic.deviceId || idx} value={mic.deviceId} className="bg-zinc-900 text-white">
                  {mic.label || `Microphone ${idx + 1}`}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
    </div>
  );
}

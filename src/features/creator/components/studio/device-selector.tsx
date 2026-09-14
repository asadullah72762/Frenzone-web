"use client";

import { Video, Mic, RefreshCw, X } from "lucide-react";

interface DeviceSelectorProps {
  cameras: MediaDeviceInfo[];
  microphones: MediaDeviceInfo[];
  selectedCameraId: string;
  selectedMicrophoneId: string;
  disabled?: boolean;
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
  onSelectCamera,
  onSelectMicrophone,
  onRefreshDevices,
  onClose,
}: DeviceSelectorProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="flex items-center justify-between pb-2.5 border-b border-border mb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand" />
          <h4 className="text-xs font-bold text-text-primary">
            Audio & Video Device Settings
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefreshDevices}
            disabled={disabled}
            className="flex items-center gap-1 text-[11px] font-bold text-brand hover:text-brand-hover disabled:opacity-50 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Rescan</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-surface-muted cursor-pointer"
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
          <label className="flex items-center gap-1.5 text-xs font-bold text-text-secondary">
            <Video className="h-3.5 w-3.5 text-brand" />
            <span>Camera Input</span>
          </label>
          <select
            value={selectedCameraId}
            disabled={disabled || cameras.length === 0}
            onChange={(e) => onSelectCamera(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-muted px-3 py-2 text-xs font-semibold text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {cameras.length === 0 ? (
              <option value="">No cameras detected</option>
            ) : (
              cameras.map((cam, idx) => (
                <option key={cam.deviceId || idx} value={cam.deviceId}>
                  {cam.label || `Camera ${idx + 1}`}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Microphone Selector */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-xs font-bold text-text-secondary">
            <Mic className="h-3.5 w-3.5 text-brand" />
            <span>Microphone Input</span>
          </label>
          <select
            value={selectedMicrophoneId}
            disabled={disabled || microphones.length === 0}
            onChange={(e) => onSelectMicrophone(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-muted px-3 py-2 text-xs font-semibold text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {microphones.length === 0 ? (
              <option value="">No microphones detected</option>
            ) : (
              microphones.map((mic, idx) => (
                <option key={mic.deviceId || idx} value={mic.deviceId}>
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

"use client";

import { Video, VideoOff, Mic, MicOff, Settings, Radio, Power, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DeviceReadinessState } from "@/features/creator/hooks/use-media-devices";

interface LiveControlsBarProps {
  isBroadcasting: boolean;
  isStarting: boolean;
  isEnding: boolean;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  cameraStatus: DeviceReadinessState;
  microphoneStatus: DeviceReadinessState;
  showSettings: boolean;
  canStartLive: boolean;
  blockerReason?: string | null;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleSettings: () => void;
  onStartLive: () => void;
  onRequestEndLive: () => void;
}

export function LiveControlsBar({
  isBroadcasting,
  isStarting,
  isEnding,
  isAudioMuted,
  isVideoMuted,
  cameraStatus,
  microphoneStatus,
  showSettings,
  canStartLive,
  blockerReason,
  onToggleAudio,
  onToggleVideo,
  onToggleSettings,
  onStartLive,
  onRequestEndLive,
}: LiveControlsBarProps) {
  const isCameraReady = cameraStatus === "ready" && !isVideoMuted;
  const isMicReady = microphoneStatus === "ready" && !isAudioMuted;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3 shadow-xl backdrop-blur-md">
      {/* Left: Media Toggles & Settings */}
      <div className="flex items-center gap-2">
        {/* Microphone Toggle */}
        <button
          type="button"
          onClick={onToggleAudio}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
            isAudioMuted
              ? "border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
              : "border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700"
          }`}
          title={isAudioMuted ? "Unmute Microphone" : "Mute Microphone"}
        >
          {isAudioMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>

        {/* Camera Toggle */}
        <button
          type="button"
          onClick={onToggleVideo}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
            isVideoMuted
              ? "border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
              : "border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700"
          }`}
          title={isVideoMuted ? "Turn Camera On" : "Turn Camera Off"}
        >
          {isVideoMuted ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
        </button>

        {/* Settings Button */}
        <button
          type="button"
          onClick={onToggleSettings}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
            showSettings
              ? "border-brand bg-brand/10 text-brand"
              : "border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700"
          }`}
          title="Audio & Video Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* Center: Compact Pre-Live Readiness Status */}
      {!isBroadcasting && (
        <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-zinc-400">
          <div className="flex items-center gap-1">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isCameraReady ? "bg-emerald-400" : cameraStatus === "off" ? "bg-zinc-500" : "bg-amber-400"
              }`}
            />
            <span className={isCameraReady ? "text-zinc-200" : "text-zinc-400"}>Camera</span>
          </div>

          <span className="text-zinc-600">•</span>

          <div className="flex items-center gap-1">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isMicReady ? "bg-emerald-400" : isAudioMuted ? "bg-zinc-500" : "bg-amber-400"
              }`}
            />
            <span className={isMicReady ? "text-zinc-200" : "text-zinc-400"}>Mic</span>
          </div>

          <span className="text-zinc-600">•</span>

          <div className="flex items-center gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${canStartLive ? "bg-emerald-400" : "bg-amber-400"}`} />
            <span className={canStartLive ? "text-emerald-400 font-semibold" : "text-zinc-400"}>
              {canStartLive ? "Ready to Go Live" : "Setup Required"}
            </span>
          </div>
        </div>
      )}

      {/* Right: Primary Action (Go Live / End Live) */}
      <div className="flex items-center gap-2">
        {!isBroadcasting ? (
          <Button
            variant="primary"
            onClick={onStartLive}
            disabled={!canStartLive || isStarting}
            icon={<Radio className={`h-4 w-4 ${isStarting ? "animate-spin" : ""}`} />}
            className={`rounded-xl px-6 py-2.5 text-xs font-bold transition-all shadow-md ${
              canStartLive
                ? "bg-gradient-to-r from-brand to-brand-hover hover:from-brand-hover hover:to-brand-active text-white shadow-brand/25 cursor-pointer hover:shadow-lg"
                : "bg-zinc-800 text-zinc-400 border border-zinc-700 opacity-80 cursor-not-allowed"
            }`}
          >
            {isStarting ? "Connecting..." : canStartLive ? "Go Live Now" : blockerReason || "Complete Setup"}
          </Button>
        ) : (
          <Button
            variant="destructive"
            onClick={onRequestEndLive}
            disabled={isEnding}
            icon={<Power className="h-4 w-4" />}
            className="rounded-xl bg-rose-600 hover:bg-rose-700 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/20 active:scale-[0.98]"
          >
            {isEnding ? "Ending Stream..." : "End Live"}
          </Button>
        )}
      </div>
    </div>
  );
}

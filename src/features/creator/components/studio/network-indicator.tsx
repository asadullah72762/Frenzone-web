"use client";

import { Wifi, WifiOff, Activity, CheckCircle2 } from "lucide-react";
import type { NetworkQualityInfo, StreamProfile } from "@/features/creator/hooks/use-agora-broadcast";

interface NetworkIndicatorProps {
  isBroadcasting: boolean;
  connectionState: string;
  networkQuality: NetworkQualityInfo;
  currentProfile: StreamProfile;
  isOnline?: boolean;
  isBackendReady?: boolean;
}

export function NetworkIndicator({
  isBroadcasting,
  connectionState,
  networkQuality,
  currentProfile,
  isOnline = true,
  isBackendReady = true,
}: NetworkIndicatorProps) {
  // Pre-Live Studio Connectivity State
  if (!isBroadcasting) {
    if (!isOnline) {
      return (
        <div className="flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-400">
          <WifiOff className="h-3.5 w-3.5" />
          <span>No Internet</span>
        </div>
      );
    }

    if (!isBackendReady) {
      return (
        <div className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300">
          <Activity className="h-3.5 w-3.5 animate-spin" />
          <span>Connecting Platform...</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span>Studio Ready</span>
      </div>
    );
  }

  // Active Live Broadcast Connectivity State
  const isConnected = connectionState === "CONNECTED";
  const isReconnecting = connectionState === "RECONNECTING" || connectionState === "CONNECTING";

  const getQualityColor = () => {
    if (!isConnected) return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    switch (networkQuality.label) {
      case "Excellent":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Good":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "Poor":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Bad":
      case "Very Bad":
      case "Down":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Dynamic Quality Badge */}
      <div
        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-md transition-colors ${getQualityColor()}`}
      >
        {isReconnecting ? (
          <>
            <Activity className="h-3.5 w-3.5 animate-spin" />
            <span>Reconnecting...</span>
          </>
        ) : isConnected ? (
          <>
            <Wifi className="h-3.5 w-3.5" />
            <span>{networkQuality.label}</span>
          </>
        ) : (
          <>
            <WifiOff className="h-3.5 w-3.5" />
            <span>Connection Lost</span>
          </>
        )}
      </div>

      {/* Adaptive Profile / Bitrate Indicator */}
      {isConnected && (
        <span className="hidden sm:inline-flex items-center rounded-md bg-zinc-900/80 px-2 py-0.5 text-[11px] font-mono text-zinc-300 border border-zinc-800 backdrop-blur-md">
          {currentProfile.toUpperCase()}
          {networkQuality.sendBitrate ? ` • ${networkQuality.sendBitrate}k` : ""}
        </span>
      )}
    </div>
  );
}

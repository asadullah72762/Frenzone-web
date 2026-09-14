"use client";

import { useState, useEffect, useRef } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  RefreshCw,
  Users,
  Gem,
  Radio,
  Power,
  Lock,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import type { DeviceReadinessState } from "@/features/creator/hooks/use-media-devices";

interface MediaPreviewProps {
  localStream: MediaStream | null;
  isBroadcasting: boolean;
  isVideoMuted: boolean;
  isAudioMuted: boolean;
  audioLevel: number; // 0 to 100
  cameraStatus: DeviceReadinessState;
  microphoneStatus: DeviceReadinessState;
  cameraStatusMessage?: string | null;
  microphoneStatusMessage?: string | null;
  hasDeviceDisconnected: boolean;
  viewerCount?: number;
  totalDiamonds?: number;
  liveDurationFormatted?: string;
  isStarting?: boolean;
  isEnding?: boolean;
  isRequesting?: boolean;
  onRetryCamera: () => void;
  onRequestPermission?: () => void;
  onOpenPermissionGuide?: () => void;
  onToggleVideo: () => void;
  onStartLive?: () => void;
  onEndLive?: () => void;
  onAttachAgoraVideo?: (el: HTMLDivElement | null) => void;
  children?: React.ReactNode;
}

export function MediaPreview({
  localStream,
  isBroadcasting,
  isVideoMuted,
  isAudioMuted,
  audioLevel,
  cameraStatus,
  microphoneStatus,
  cameraStatusMessage,
  microphoneStatusMessage,
  hasDeviceDisconnected,
  viewerCount = 0,
  totalDiamonds = 0,
  liveDurationFormatted = "00:00:00",
  isStarting = false,
  isEnding = false,
  isRequesting = false,
  onRetryCamera,
  onRequestPermission,
  onOpenPermissionGuide,
  onToggleVideo,
  onStartLive,
  onEndLive,
  onAttachAgoraVideo,
  children,
}: MediaPreviewProps) {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const agoraContainerRef = useRef<HTMLDivElement | null>(null);

  // Bind local preview stream - with direct DOM muted enforcement and onloadedmetadata
  useEffect(() => {
    const videoEl = localVideoRef.current;
    if (!videoEl) return;

    // Enforce DOM property muted to prevent browser autoplay restriction
    videoEl.muted = true;

    if (localStream && localStream.getVideoTracks().length > 0) {
      videoEl.srcObject = localStream;
      const playVideo = () => {
        videoEl.play().catch((err) => {
          console.warn("Video preview play error note:", err);
        });
      };
      videoEl.onloadedmetadata = playVideo;
      playVideo();
    } else {
      videoEl.srcObject = null;
    }
  }, [localStream, cameraStatus]);

  // Connect Agora video track element if remote/RTC playback is attached
  useEffect(() => {
    if (isBroadcasting && onAttachAgoraVideo && agoraContainerRef.current) {
      onAttachAgoraVideo(agoraContainerRef.current);
    }
  }, [isBroadcasting, onAttachAgoraVideo]);

  const isCameraActive =
    cameraStatus === "ready" && !isVideoMuted && localStream && localStream.getVideoTracks().length > 0;

  const isPermissionBlocked = cameraStatus === "blocked" || microphoneStatus === "blocked";
  const isCameraInUse = cameraStatus === "in-use";

  const handleAllowPermissions = () => {
    if (onRequestPermission) {
      onRequestPermission();
    } else {
      onRetryCamera();
    }
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950 shadow-2xl flex items-center justify-center">
      {/* 1. Persistent Video Element — Always renders local camera */}
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className={`h-full w-full object-cover -scale-x-100 transition-opacity duration-300 ${
          !isVideoMuted && localStream && localStream.getVideoTracks().length > 0
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* 2. Optional Agora Container for RTC playback */}
      <div
        ref={agoraContainerRef}
        className={`absolute inset-0 h-full w-full object-cover pointer-events-none transition-opacity duration-300 z-10 ${
          isBroadcasting && !isVideoMuted ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* 3. Pre-Live State (When Camera is Not Active — NEVER shown during live broadcast) */}
      {!isBroadcasting && !isCameraActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-zinc-950/90 backdrop-blur-sm">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl mb-3 shadow-lg ${
              isPermissionBlocked
                ? "bg-rose-500/10 border border-rose-500/30 text-rose-500 shadow-rose-500/10"
                : isCameraInUse
                ? "bg-amber-500/10 border border-amber-500/30 text-amber-500 shadow-amber-500/10"
                : "bg-brand/10 border border-brand/30 text-brand shadow-brand/10"
            }`}
          >
            {isPermissionBlocked ? (
              <Lock className="h-8 w-8 text-rose-500" />
            ) : isCameraInUse ? (
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            ) : (
              <Video className="h-8 w-8 text-brand" />
            )}
          </div>

          <h4 className="text-base font-bold text-white tracking-tight">
            {isPermissionBlocked
              ? "Camera & Microphone Access Blocked"
              : isCameraInUse
              ? "Camera In Use by Another App"
              : cameraStatus === "loading"
              ? "Connecting Camera Feed..."
              : "Camera Feed Not Active"}
          </h4>

          <p className="text-xs text-zinc-300 max-w-md mt-1.5 mb-3 leading-relaxed font-medium">
            {isPermissionBlocked
              ? cameraStatusMessage ||
                "Your browser has blocked camera and microphone access. Please allow permissions in your address bar site settings."
              : isCameraInUse
              ? cameraStatusMessage ||
                "Another application (e.g. OBS, Zoom, Teams) is using your webcam. Please close it and retry."
              : cameraStatusMessage ||
                "Click below to grant camera access and start broadcasting."}
          </p>

          {/* Inline Address Bar Lock Hint for Blocked State */}
          {isPermissionBlocked && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-zinc-900/90 border border-zinc-800 px-3.5 py-2 text-[11px] text-zinc-300">
              <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>
                Tip: Click the <strong className="text-white">🔒 Lock</strong> or{" "}
                <strong className="text-white">Tune icon</strong> in your browser address bar → switch Camera & Mic to{" "}
                <strong className="text-emerald-400">Allow</strong>.
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleAllowPermissions}
              disabled={isRequesting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-hover hover:from-brand-hover hover:to-brand-active px-6 py-3 text-xs font-bold text-white shadow-xl shadow-brand/25 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-60"
            >
              {isRequesting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : isPermissionBlocked ? (
                <RefreshCw className="h-4 w-4" />
              ) : (
                <Video className="h-4 w-4" />
              )}
              <span>
                {isRequesting
                  ? "Requesting Access..."
                  : isPermissionBlocked
                  ? "Check Permissions Again"
                  : "Allow Camera & Mic"}
              </span>
            </button>

            {onOpenPermissionGuide && (
              <button
                type="button"
                onClick={onOpenPermissionGuide}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800 px-4 py-3 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
              >
                <HelpCircle className="h-3.5 w-3.5 text-brand" />
                <span>How to Unblock</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. Video Muted Overlay */}
      {isVideoMuted && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 text-zinc-400 z-20">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 mb-2 border border-zinc-700">
            <VideoOff className="h-6 w-6 text-zinc-400" />
          </div>
          <p className="text-sm font-semibold text-zinc-200">Video Paused</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {isBroadcasting ? "Live audio is currently active" : "Camera video track is muted"}
          </p>
        </div>
      )}

      {/* 6. Top HUD (When Broadcasting) */}
      {isBroadcasting && (
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-30">
          {/* Left: Pulsing Live Badge & Duration Clock */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-rose-600 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg animate-pulse">
              <span className="h-2 w-2 rounded-full bg-white" />
              LIVE
            </div>
            <div className="rounded-full bg-zinc-900/90 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-zinc-100 border border-zinc-800 shadow">
              {liveDurationFormatted}
            </div>
          </div>

          {/* Right: Real-time Live Viewer Counting & Total Diamonds */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-zinc-900/90 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-zinc-100 border border-zinc-800 shadow-md">
              <Users className="h-4 w-4 text-brand" />
              <span className="tracking-tight">
                {viewerCount.toLocaleString()}{" "}
                <span className="text-[10px] font-normal text-zinc-400">Viewers</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20 shadow">
              <Gem className="h-3.5 w-3.5 text-amber-400" />
              <span>{totalDiamonds.toLocaleString()}</span>
            </div>
            {onEndLive && (
              <button
                type="button"
                onClick={onEndLive}
                disabled={isEnding}
                className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-rose-600 hover:bg-rose-700 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <Power className="h-3.5 w-3.5" />
                <span>{isEnding ? "Ending..." : "End Live"}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 7. Direct On-Canvas 'START LIVE NOW' Action (Pre-live Hero Overlay) */}
      {!isBroadcasting && isCameraActive && onStartLive && (
        <div className="absolute bottom-6 left-1/2 -translate-y-0 -translate-x-1/2 z-30 flex items-center">
          <button
            type="button"
            onClick={onStartLive}
            disabled={isStarting}
            className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand via-amber-500 to-brand hover:from-brand-hover hover:to-amber-600 px-8 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-2xl shadow-brand/40 hover:shadow-brand/60 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-white/20"
          >
            <Radio className={`h-5 w-5 ${isStarting ? "animate-spin" : "animate-pulse"}`} />
            <span>{isStarting ? "Starting Live..." : "START LIVE NOW"}</span>
          </button>
        </div>
      )}

      {/* 8. Bottom Left: Audio VU Meter */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-lg bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 border border-zinc-800/80 pointer-events-none shadow">
        {isAudioMuted ? (
          <MicOff className="h-3.5 w-3.5 text-rose-400" />
        ) : (
          <Mic className="h-3.5 w-3.5 text-emerald-400" />
        )}
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-800">
          <div
            className={`h-full transition-all duration-75 ${
              isAudioMuted
                ? "w-0 bg-transparent"
                : audioLevel > 75
                ? "bg-rose-500"
                : audioLevel > 40
                ? "bg-amber-400"
                : "bg-emerald-400"
            }`}
            style={{ width: `${isAudioMuted ? 0 : audioLevel}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-zinc-400">
          {isAudioMuted ? "MUTED" : microphoneStatus === "ready" ? `${audioLevel}%` : "OFF"}
        </span>
      </div>

      {/* 9. Integrated Live Chat / Children Overlay Slot */}
      {children}
    </div>
  );
}

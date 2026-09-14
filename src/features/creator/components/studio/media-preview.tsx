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
  ArrowLeft,
  Settings,
  SwitchCamera,
  MessageSquare,
  X,
  Activity,
} from "lucide-react";
import type { DeviceReadinessState } from "@/features/creator/hooks/use-media-devices";
import { DeviceSelector } from "@/features/creator/components/studio/device-selector";

export interface MediaPreviewProps {
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
  streamTitle?: string;
  category?: string;
  isStarting?: boolean;
  isEnding?: boolean;
  isRequesting?: boolean;
  canFlipCamera?: boolean;
  isReconnecting?: boolean;
  cameras?: MediaDeviceInfo[];
  microphones?: MediaDeviceInfo[];
  selectedCameraId?: string;
  selectedMicrophoneId?: string;
  isChatOpen?: boolean;
  onToggleChat?: () => void;
  onRetryCamera: () => void;
  onRequestPermission?: () => void;
  onOpenPermissionGuide?: () => void;
  onToggleVideo: () => void;
  onToggleAudio?: () => void;
  onFlipCamera?: () => void;
  onSelectCamera?: (deviceId: string) => void;
  onSelectMicrophone?: (deviceId: string) => void;
  onRefreshDevices?: () => void;
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
  streamTitle = "Live Broadcast",
  category = "Just Chatting",
  isStarting = false,
  isEnding = false,
  isRequesting = false,
  canFlipCamera = false,
  isReconnecting = false,
  cameras = [],
  microphones = [],
  selectedCameraId = "",
  selectedMicrophoneId = "",
  isChatOpen = true,
  onToggleChat,
  onRetryCamera,
  onRequestPermission,
  onOpenPermissionGuide,
  onToggleVideo,
  onToggleAudio,
  onFlipCamera,
  onSelectCamera,
  onSelectMicrophone,
  onRefreshDevices,
  onStartLive,
  onEndLive,
  onAttachAgoraVideo,
  children,
}: MediaPreviewProps) {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const agoraContainerRef = useRef<HTMLDivElement | null>(null);

  // In-broadcast popovers
  const [showLiveSettings, setShowLiveSettings] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  // Bind local preview stream with strict muted property for iOS Safari autoplay compliance
  useEffect(() => {
    const videoEl = localVideoRef.current;
    if (!videoEl) return;

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

  const handleTriggerEndStream = () => {
    setShowEndConfirm(true);
  };

  const handleConfirmEndStream = () => {
    setShowEndConfirm(false);
    if (onEndLive) {
      onEndLive();
    }
  };

  return (
    <div
      style={{
        height: isBroadcasting ? "100dvh" : undefined,
        minHeight: isBroadcasting ? "-webkit-fill-available" : undefined,
      }}
      className={`relative w-full overflow-hidden bg-black flex items-center justify-center transition-all duration-300 select-none ${
        isBroadcasting
          ? "fixed inset-0 z-50 h-[100dvh] w-screen rounded-none border-none shadow-none overscroll-none touch-manipulation"
          : "aspect-[9/16] sm:aspect-video rounded-3xl border border-zinc-800/80 shadow-2xl max-h-[72dvh] sm:max-h-none"
      }`}
    >
      {/* 1. Video Element — Edge-to-edge camera coverage with iOS Safari inline play */}
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
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-zinc-950/95 backdrop-blur-md">
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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md text-zinc-400 z-20">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 mb-2 border border-white/15">
            <VideoOff className="h-7 w-7 text-white/80" />
          </div>
          <p className="text-sm font-bold text-white">Video Paused</p>
          <p className="text-xs text-white/60 mt-0.5">
            {isBroadcasting ? "Live audio is currently streaming" : "Camera video track is turned off"}
          </p>
        </div>
      )}

      {/* 5. TOP FLOATING GLASS HUD (Live Air Mode - Full Safe-Area Inset Support) */}
      {isBroadcasting && (
        <div className="absolute top-0 inset-x-0 z-30 pt-[max(env(safe-area-inset-top,0px),1rem)] px-3 sm:px-5 pb-2 flex items-center justify-between pointer-events-none">
          {/* Left Group: Exit/Back + LIVE Pulse + Duration Clock */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={handleTriggerEndStream}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 active:scale-95 transition-all shadow-lg cursor-pointer"
              title="End Stream"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 text-[11px] sm:text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-rose-600/30 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-white" />
              LIVE
            </div>

            <div className="rounded-full bg-black/40 backdrop-blur-xl border border-white/15 px-3 py-1 text-[11px] sm:text-xs font-mono font-bold text-white shadow-md">
              {liveDurationFormatted}
            </div>
          </div>

          {/* Center: Stream Title & Category Pill (Hidden on narrow screens) */}
          <div className="hidden md:flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 px-3.5 py-1 text-xs text-white/90 shadow-md max-w-xs truncate">
            <span className="font-bold truncate">{streamTitle}</span>
            <span className="text-white/40">•</span>
            <span className="text-amber-300 font-semibold shrink-0">{category}</span>
          </div>

          {/* Right Group: Real-time Viewers + Diamonds Counter */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 px-3 py-1 text-[11px] sm:text-xs font-bold text-white shadow-md">
              <Users className="h-3.5 w-3.5 text-brand" />
              <span>{viewerCount.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-amber-500/20 backdrop-blur-xl border border-amber-500/30 px-3 py-1 text-[11px] sm:text-xs font-bold text-amber-300 shadow-md">
              <Gem className="h-3.5 w-3.5 text-amber-400" />
              <span>{totalDiamonds.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Reconnecting Alert Banner */}
      {isBroadcasting && isReconnecting && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full bg-amber-500/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-black shadow-lg animate-pulse">
          <Activity className="h-3.5 w-3.5 animate-spin text-black" />
          <span>Connection degraded. Reconnecting broadcast...</span>
        </div>
      )}

      {/* 6. PRE-LIVE QUICK FLIP CAMERA (Top-Right on Mobile/Tablet when not broadcasting) */}
      {!isBroadcasting && isCameraActive && onFlipCamera && canFlipCamera && (
        <button
          type="button"
          onClick={onFlipCamera}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-xl border border-white/20 text-white hover:bg-black/70 active:scale-95 transition-all shadow-lg cursor-pointer"
          title="Flip Camera"
        >
          <SwitchCamera className="h-5 w-5" />
        </button>
      )}

      {/* 7. PRE-LIVE 'START LIVE NOW' BUTTON (Ultra-Sleek Glass Pill, Perfectly Scaled for Mobile) */}
      {!isBroadcasting && isCameraActive && onStartLive && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center max-w-[90%] sm:max-w-none">
          <button
            type="button"
            onClick={onStartLive}
            disabled={isStarting}
            className="flex items-center justify-center gap-2 sm:gap-2.5 rounded-full bg-gradient-to-r from-brand via-amber-500 to-brand hover:from-brand-hover hover:to-amber-600 px-5 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-brand/35 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/25 whitespace-nowrap"
          >
            <Radio className={`h-4 w-4 shrink-0 ${isStarting ? "animate-spin" : "animate-pulse"}`} />
            <span>{isStarting ? "Starting..." : "START LIVE NOW"}</span>
          </button>
        </div>
      )}

      {/* 8. PRE-LIVE AUDIO VU METER (Bottom-Left) */}
      {!isBroadcasting && isCameraActive && (
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-xl px-3 py-1.5 border border-white/10 pointer-events-none shadow">
          {isAudioMuted ? (
            <MicOff className="h-3.5 w-3.5 text-rose-400" />
          ) : (
            <Mic className="h-3.5 w-3.5 text-emerald-400" />
          )}
          <div className="h-1.5 w-14 overflow-hidden rounded-full bg-white/20">
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
          <span className="text-[10px] font-mono text-zinc-300">
            {isAudioMuted ? "MUTED" : microphoneStatus === "ready" ? `${audioLevel}%` : "OFF"}
          </span>
        </div>
      )}

      {/* 9. FLOATING LIVE CHAT PANEL (Slot for LiveChatPanel) */}
      {children}

      {/* 10. BOTTOM FLOATING GLASS CONTROL DOCK (Live Air Mode - Full Safe-Area Inset Support) */}
      {isBroadcasting && (
        <div className="absolute bottom-0 inset-x-0 z-30 pb-[max(env(safe-area-inset-bottom,0px),1rem)] px-3 sm:px-4 pt-2 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 sm:gap-3 rounded-full bg-black/50 backdrop-blur-2xl border border-white/20 p-2 sm:p-2.5 shadow-2xl pointer-events-auto">
            {/* Mic Toggle Button */}
            <button
              type="button"
              onClick={onToggleAudio}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-all cursor-pointer shadow-md active:scale-95 ${
                isAudioMuted
                  ? "bg-rose-600 text-white shadow-rose-600/40"
                  : "bg-white/15 hover:bg-white/25 text-white"
              }`}
              title={isAudioMuted ? "Unmute Microphone" : "Mute Microphone"}
            >
              {isAudioMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5 text-emerald-400" />}
            </button>

            {/* Video Toggle Button */}
            <button
              type="button"
              onClick={onToggleVideo}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-all cursor-pointer shadow-md active:scale-95 ${
                isVideoMuted
                  ? "bg-rose-600 text-white shadow-rose-600/40"
                  : "bg-white/15 hover:bg-white/25 text-white"
              }`}
              title={isVideoMuted ? "Turn Camera On" : "Turn Camera Off"}
            >
              {isVideoMuted ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5 text-white" />}
            </button>

            {/* Flip Camera Button (Only if multiple cameras or onFlipCamera provided) */}
            {onFlipCamera && (
              <button
                type="button"
                onClick={onFlipCamera}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer shadow-md active:scale-95"
                title="Flip Camera"
              >
                <SwitchCamera className="h-5 w-5" />
              </button>
            )}

            {/* Chat Toggle Button */}
            {onToggleChat && (
              <button
                type="button"
                onClick={onToggleChat}
                className={`flex h-11 w-11 items-center justify-center rounded-full transition-all cursor-pointer shadow-md active:scale-95 ${
                  isChatOpen
                    ? "bg-brand/80 text-white shadow-brand/30 border border-brand/40"
                    : "bg-white/15 hover:bg-white/25 text-white"
                }`}
                title={isChatOpen ? "Hide Live Chat" : "Show Live Chat"}
              >
                <MessageSquare className="h-5 w-5" />
              </button>
            )}

            {/* Device Settings Button */}
            <button
              type="button"
              onClick={() => setShowLiveSettings((prev) => !prev)}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-all cursor-pointer shadow-md active:scale-95 ${
                showLiveSettings
                  ? "bg-brand text-white"
                  : "bg-white/15 hover:bg-white/25 text-white"
              }`}
              title="Hardware & Audio Settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* End Broadcast Action Pill */}
            <button
              type="button"
              onClick={handleTriggerEndStream}
              disabled={isEnding}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-600/40 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Power className="h-4 w-4" />
              <span>{isEnding ? "Ending..." : "END"}</span>
            </button>
          </div>
        </div>
      )}

      {/* 11. IN-BROADCAST FLOATING GLASS DEVICE SETTINGS SHEET */}
      {isBroadcasting && showLiveSettings && (
        <div className="absolute inset-x-4 bottom-24 max-w-md mx-auto z-40 animate-in fade-in slide-in-from-bottom-6 duration-200">
          <DeviceSelector
            variant="glass"
            cameras={cameras}
            microphones={microphones}
            selectedCameraId={selectedCameraId}
            selectedMicrophoneId={selectedMicrophoneId}
            onSelectCamera={(id) => {
              if (onSelectCamera) onSelectCamera(id);
            }}
            onSelectMicrophone={(id) => {
              if (onSelectMicrophone) onSelectMicrophone(id);
            }}
            onRefreshDevices={onRefreshDevices || (() => {})}
            onClose={() => setShowLiveSettings(false)}
          />
        </div>
      )}

      {/* 12. FROSTED GLASS END BROADCAST CONFIRMATION MODAL */}
      {showEndConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xs sm:max-w-sm rounded-3xl border border-white/20 bg-zinc-950/90 backdrop-blur-2xl p-6 text-center text-white shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/30 shadow-lg shadow-rose-500/20">
              <Power className="h-7 w-7" />
            </div>

            <h3 className="text-base font-bold text-white">End Live Broadcast?</h3>
            <p className="mt-1 text-xs text-zinc-300 leading-relaxed font-medium">
              Are you sure you want to end your live stream? Your viewers will see your final stream summary.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Continue Live
              </button>
              <button
                type="button"
                onClick={handleConfirmEndStream}
                disabled={isEnding}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-rose-600/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isEnding ? "Ending..." : "End Stream"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

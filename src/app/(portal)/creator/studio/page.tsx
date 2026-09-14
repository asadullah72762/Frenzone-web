"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Radio, ArrowLeft, Activity, ChevronDown, Mic, MicOff, Video, VideoOff, Settings, Power, Users, Gem, MessageSquare, SwitchCamera } from "lucide-react";
import { creatorLiveService, type LiveStatusResponse, type LiveSessionResponse } from "@/features/creator/services/creator-live.service";
import { LiveAccessDeniedModal } from "@/features/creator/components/live-access-denied-modal";
import { useMediaDevices } from "@/features/creator/hooks/use-media-devices";
import { useAgoraBroadcast } from "@/features/creator/hooks/use-agora-broadcast";
import { useLiveSocket } from "@/features/creator/hooks/use-live-socket";
import { MediaPreview } from "@/features/creator/components/studio/media-preview";
import { DeviceSelector } from "@/features/creator/components/studio/device-selector";
import { LiveChatPanel } from "@/features/creator/components/studio/live-chat-panel";
import { NetworkIndicator } from "@/features/creator/components/studio/network-indicator";
import { PostStreamModal, type StreamSummaryData } from "@/features/creator/components/studio/post-stream-modal";
import { PermissionGuideModal } from "@/features/creator/components/studio/permission-guide-modal";

export default function CreatorStudioPage() {
  const router = useRouter();

  // 1. Live Access Authorization State
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [liveAccessData, setLiveAccessData] = useState<LiveStatusResponse | null>(null);
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
  const [showPermissionGuideModal, setShowPermissionGuideModal] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // 2. Stream Meta Details (Default title provided for immediate 1-click go live)
  const [streamTitle, setStreamTitle] = useState("Live Broadcast 🔥");
  const [category, setCategory] = useState("Just Chatting");
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);

  // 3. Active Broadcast Session State
  const [activeSession, setActiveSession] = useState<LiveSessionResponse["session"] | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [liveDurationSeconds, setLiveDurationSeconds] = useState(0);
  const [summaryData, setSummaryData] = useState<StreamSummaryData | null>(null);
  const [showPostStreamModal, setShowPostStreamModal] = useState(false);

  // 4. Custom Media, RTC & Socket Hooks
  const media = useMediaDevices();
  const agora = useAgoraBroadcast();
  const socket = useLiveSocket();

  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Quick camera flip (mobile front/back toggle)
  const handleFlipCamera = useCallback(async () => {
    if (!media.cameras || media.cameras.length < 2) return;
    const currentIndex = media.cameras.findIndex((c) => c.deviceId === media.selectedCameraId);
    const nextIndex = (currentIndex + 1) % media.cameras.length;
    const nextCamera = media.cameras[nextIndex];
    if (nextCamera) {
      if (agora.isBroadcasting) {
        await agora.switchCamera(nextCamera.deviceId);
      } else {
        await media.switchCamera(nextCamera.deviceId);
      }
    }
  }, [media.cameras, media.selectedCameraId, agora.isBroadcasting, agora.switchCamera, media.switchCamera]);

  // Monitor browser network online/offline events
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Format Duration HH:MM:SS
  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? `0${v}` : v))
      .join(":");
  };

  // Pre-flight Live Access Verification
  const verifyLiveAccess = useCallback(async () => {
    setIsCheckingAccess(true);
    try {
      const status = await creatorLiveService.checkLiveStatus();
      setLiveAccessData(status);

      if (!status.authorized) {
        setShowAccessDeniedModal(true);
      } else {
        // Automatically attempt unified camera/mic initialization
        await media.startPreview();
      }
    } catch (err) {
      console.error("Failed to verify live access:", err);
      setShowAccessDeniedModal(true);
    } finally {
      setIsCheckingAccess(false);
    }
  }, []);

  useEffect(() => {
    verifyLiveAccess();
  }, [verifyLiveAccess]);

  // Handle Starting Broadcast (Direct 1-click go live)
  const handleStartLive = async () => {
    setIsStarting(true);
    try {
      // 1. If media stream is not active yet, proactively request browser permission
      if (!media.localStream) {
        const stream = await media.requestPermission();
        if (!stream) {
          setShowPermissionGuideModal(true);
          throw new Error("Camera and microphone permission required to start live broadcast. Please allow access in browser site settings.");
        }
      }

      const finalTitle = streamTitle.trim() || "Live Broadcast 🔥";

      // 2. Backend Authoritative Session Initialization
      const sessionRes = await creatorLiveService.startLiveSession({
        title: finalTitle,
        category,
      });

      if (!sessionRes.success || !sessionRes.session) {
        throw new Error("Could not initialize live session on backend.");
      }

      const s = sessionRes.session;
      setActiveSession(s);

      // 3. Connect Agora Web RTC Broadcast Host
      await agora.joinAndPublish({
        appId: s.appId,
        channelName: s.channelName,
        token: s.token,
        uid: s.uid,
        cameraId: media.selectedCameraId || undefined,
        microphoneId: media.selectedMicrophoneId || undefined,
      });

      // 5. Connect Real-Time Live Signaling Socket
      socket.connect(s.streamId, {
        id: String(s.uid),
        name: s.channelName,
      });

      // 6. Start Authoritative Heartbeat Timer (every 10s)
      heartbeatTimerRef.current = setInterval(() => {
        creatorLiveService.sendHeartbeat(s.streamId, {
          viewerCount: socket.viewerCount,
          diamondsEarned: socket.totalDiamonds,
        });
      }, 10000);

      // 7. Start Duration Timer (every 1s)
      setLiveDurationSeconds(0);
      durationTimerRef.current = setInterval(() => {
        setLiveDurationSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Failed to start live stream:", err);
      // Restore local preview if Agora or connection failed
      if (!media.localStream) {
        media.startPreview(media.selectedCameraId, media.selectedMicrophoneId);
      }
      alert(err.message || "Failed to start live broadcast. Please check your connection.");
      await agora.leaveAndUnpublish();
      socket.disconnect();
    } finally {
      setIsStarting(false);
    }
  };

  // Handle Ending Broadcast
  const handleEndLive = async () => {
    if (!activeSession) return;

    const confirmEnd = window.confirm("Are you sure you want to end your live stream?");
    if (!confirmEnd) return;

    setIsEnding(true);

    if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
    if (durationTimerRef.current) clearInterval(durationTimerRef.current);

    try {
      // 1. Notify backend to finalize session and persist StreamAnalysis
      const endRes = await creatorLiveService.endLiveSession(activeSession.streamId, {
        durationSeconds: liveDurationSeconds,
        peakViewers: Math.max(socket.viewerCount, 1),
        totalDiamonds: socket.totalDiamonds,
      });

      // 2. Disconnect Agora RTC and Socket
      await agora.leaveAndUnpublish();
      socket.disconnect();

      // 3. Prepare summary data
      const summary = endRes.summary;
      setSummaryData({
        streamId: activeSession.streamId,
        title: streamTitle,
        durationFormatted: formatDuration(liveDurationSeconds),
        totalViewers: Math.max(socket.viewerCount, 1),
        peakViewers: Math.max(socket.viewerCount, 1),
        diamondsEarned: summary?.diamondsEarned ?? socket.totalDiamonds,
        estimatedEarningsUSD: Number((summary?.diamondsEarned ?? socket.totalDiamonds) * 0.042).toFixed(2),
      });

      setShowPostStreamModal(true);
      setActiveSession(null);

      // Ensure local media preview is active for pre-live stage
      if (!media.localStream) {
        await media.startPreview(media.selectedCameraId, media.selectedMicrophoneId);
      }
    } catch (err: any) {
      console.error("Failed to cleanly end stream:", err);
      alert(err.message || "Stream ended with warning.");
    } finally {
      setIsEnding(false);
    }
  };

  // Pre-flight loading view
  if (isCheckingAccess) {
    return (
      <div className="flex min-h-[600px] flex-col items-center justify-center space-y-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand animate-pulse border border-brand/20">
          <Radio className="h-6 w-6 animate-spin" />
        </div>
        <div>
          <h3 className="text-base font-bold text-text-primary">Connecting to Studio</h3>
          <p className="text-xs text-text-secondary mt-1">Verifying creator broadcast authorization...</p>
        </div>
      </div>
    );
  }

  // 5. Broadcaster Stage Immersion View (When live on air - 100% full glass screen)
  if (agora.isBroadcasting) {
    return (
      <div className="fixed inset-0 z-50 h-[100dvh] w-screen overflow-hidden bg-black select-none overscroll-none touch-manipulation">
        <MediaPreview
          localStream={media.localStream}
          isBroadcasting={true}
          isVideoMuted={agora.isVideoMuted}
          isAudioMuted={agora.isAudioMuted}
          audioLevel={media.audioLevel}
          cameraStatus={media.cameraStatus}
          microphoneStatus={media.microphoneStatus}
          cameraStatusMessage={media.cameraStatusMessage}
          microphoneStatusMessage={media.microphoneStatusMessage}
          hasDeviceDisconnected={media.hasDeviceDisconnected}
          viewerCount={socket.viewerCount}
          totalDiamonds={socket.totalDiamonds}
          liveDurationFormatted={formatDuration(liveDurationSeconds)}
          streamTitle={streamTitle}
          category={category}
          isStarting={isStarting}
          isEnding={isEnding}
          isRequesting={media.isRequesting}
          canFlipCamera={media.cameras.length > 1}
          isReconnecting={agora.connectionState === "RECONNECTING"}
          cameras={media.cameras}
          microphones={media.microphones}
          selectedCameraId={media.selectedCameraId}
          selectedMicrophoneId={media.selectedMicrophoneId}
          isChatOpen={isChatOpen}
          onToggleChat={() => setIsChatOpen((prev) => !prev)}
          onRetryCamera={() => media.startPreview(media.selectedCameraId, media.selectedMicrophoneId)}
          onRequestPermission={() => media.requestPermission()}
          onOpenPermissionGuide={() => setShowPermissionGuideModal(true)}
          onToggleVideo={agora.toggleMuteVideo}
          onToggleAudio={agora.toggleMuteAudio}
          onFlipCamera={media.cameras.length > 1 ? handleFlipCamera : undefined}
          onSelectCamera={agora.switchCamera}
          onSelectMicrophone={agora.switchMicrophone}
          onRefreshDevices={media.enumerateDevices}
          onEndLive={handleEndLive}
          onAttachAgoraVideo={agora.attachVideoElement}
        >
          {isChatOpen && (
            <LiveChatPanel
              comments={socket.comments}
              latestGift={socket.latestGift}
              isBroadcasting={true}
              onSendHostComment={socket.sendHostComment}
              variant="overlay"
              onClose={() => setIsChatOpen(false)}
            />
          )}
        </MediaPreview>

        {/* Post-Stream Summary Modal */}
        <PostStreamModal
          isOpen={showPostStreamModal}
          summary={summaryData}
          onClose={() => setShowPostStreamModal(false)}
          onReturnDashboard={() => router.push("/creator")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/creator"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text-primary hover:bg-surface-muted transition-colors shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
                Frenzone Live Studio
              </h1>
            </div>
            <p className="text-xs font-medium text-text-secondary mt-0.5">
              Broadcast high definition live video directly to your Frenzone community.
            </p>
          </div>
        </div>

        {/* Live / Studio Connectivity Indicator */}
        <NetworkIndicator
          isBroadcasting={false}
          connectionState={agora.connectionState}
          networkQuality={agora.networkQuality}
          currentProfile={agora.currentProfile}
          isOnline={isOnline}
          isBackendReady={liveAccessData?.authorized === true}
        />
      </div>

      {/* Main Studio — Single Unified Stage */}
      <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-surface p-5 md:p-6 shadow-sm space-y-4">
        {/* Stream Details Ribbon (Title & Category) — Cleanly positioned at top of studio stage */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              placeholder="Add a broadcast title (e.g. Sunday Hangout & AMA 🔥)..."
              maxLength={80}
              className="w-full rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-sm font-semibold text-text-primary placeholder:text-text-muted outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all shadow-inner"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono font-medium text-text-muted">
              {streamTitle.length}/80
            </span>
          </div>

          <div className="w-full sm:w-56">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-muted px-3.5 py-2.5 text-xs font-bold text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer shadow-inner"
            >
              <option value="Just Chatting">Just Chatting</option>
              <option value="Gaming & Esports">Gaming & Esports</option>
              <option value="Music & Performance">Music & Performance</option>
              <option value="Fitness & Wellness">Fitness & Wellness</option>
              <option value="Art & Creative">Art & Creative</option>
              <option value="Education & Tech">Education & Tech</option>
              <option value="Lifestyle & Vlogs">Lifestyle & Vlogs</option>
            </select>
          </div>
        </div>

        {/* Video Stage with Persistent Element and Direct On-Canvas Action */}
        <MediaPreview
          localStream={media.localStream}
          isBroadcasting={false}
          isVideoMuted={media.isVideoMuted}
          isAudioMuted={media.isAudioMuted}
          audioLevel={media.audioLevel}
          cameraStatus={media.cameraStatus}
          microphoneStatus={media.microphoneStatus}
          cameraStatusMessage={media.cameraStatusMessage}
          microphoneStatusMessage={media.microphoneStatusMessage}
          hasDeviceDisconnected={media.hasDeviceDisconnected}
          streamTitle={streamTitle}
          category={category}
          isStarting={isStarting}
          isEnding={isEnding}
          isRequesting={media.isRequesting}
          canFlipCamera={media.cameras.length > 1}
          cameras={media.cameras}
          microphones={media.microphones}
          selectedCameraId={media.selectedCameraId}
          selectedMicrophoneId={media.selectedMicrophoneId}
          onRetryCamera={() => media.startPreview(media.selectedCameraId, media.selectedMicrophoneId)}
          onRequestPermission={() => media.requestPermission()}
          onOpenPermissionGuide={() => setShowPermissionGuideModal(true)}
          onToggleVideo={media.toggleMuteVideo}
          onToggleAudio={media.toggleMuteAudio}
          onFlipCamera={media.cameras.length > 1 ? handleFlipCamera : undefined}
          onSelectCamera={media.switchCamera}
          onSelectMicrophone={media.switchMicrophone}
          onRefreshDevices={media.enumerateDevices}
          onStartLive={handleStartLive}
        />

        {/* Collapsible Device Settings Popover */}
        {showDeviceSettings && (
          <DeviceSelector
            cameras={media.cameras}
            microphones={media.microphones}
            selectedCameraId={media.selectedCameraId}
            selectedMicrophoneId={media.selectedMicrophoneId}
            onSelectCamera={media.switchCamera}
            onSelectMicrophone={media.switchMicrophone}
            onRefreshDevices={media.enumerateDevices}
            onClose={() => setShowDeviceSettings(false)}
          />
        )}

        {/* Studio Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
          {/* Media Toggles & Device Settings */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={media.toggleMuteAudio}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all cursor-pointer shadow-sm ${
                media.isAudioMuted
                  ? "border-rose-500/40 bg-rose-50 text-rose-600"
                  : "border-border bg-surface-muted text-text-primary hover:bg-surface"
              }`}
              title="Toggle Microphone"
            >
              {media.isAudioMuted ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5 text-emerald-600" />
              )}
            </button>

            <button
              type="button"
              onClick={media.toggleMuteVideo}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all cursor-pointer shadow-sm ${
                media.isVideoMuted
                  ? "border-rose-500/40 bg-rose-50 text-rose-600"
                  : "border-border bg-surface-muted text-text-primary hover:bg-surface"
              }`}
              title="Toggle Camera"
            >
              {media.isVideoMuted ? (
                <VideoOff className="h-5 w-5" />
              ) : (
                <Video className="h-5 w-5 text-brand" />
              )}
            </button>

            {media.cameras.length > 1 && (
              <button
                type="button"
                onClick={handleFlipCamera}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface-muted text-text-primary hover:bg-surface transition-all cursor-pointer shadow-sm"
                title="Flip Camera"
              >
                <SwitchCamera className="h-5 w-5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowDeviceSettings((prev) => !prev)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all cursor-pointer shadow-sm ${
                showDeviceSettings
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border bg-surface-muted text-text-primary hover:bg-surface"
              }`}
              title="Audio & Video Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>

          {/* Action Button: START LIVE NOW (Desktop View - Mobile uses on-canvas hero pill) */}
          <div className="w-full sm:w-auto hidden sm:flex justify-end">
            <button
              type="button"
              onClick={handleStartLive}
              disabled={isStarting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-2.5 rounded-xl bg-gradient-to-r from-brand to-brand-hover hover:from-brand-hover hover:to-brand-active px-5 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white shadow-lg sm:shadow-xl shadow-brand/25 hover:shadow-2xl transition-all cursor-pointer active:scale-[0.98] whitespace-nowrap"
            >
              <Radio className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${isStarting ? "animate-spin" : ""}`} />
              <span>{isStarting ? "Starting..." : "START LIVE NOW"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Developer Diagnostics (Discreetly collapsed at bottom for admin/developer inspection only) */}
      <details className="mx-auto max-w-4xl rounded-xl border border-border bg-surface p-3 text-xs text-text-muted">
        <summary className="cursor-pointer font-mono text-[11px] text-text-muted hover:text-text-primary flex items-center justify-between">
          <span>⚙ Developer Diagnostics (Debug Information)</span>
          <ChevronDown className="h-3 w-3" />
        </summary>
        <div className="mt-3 space-y-1.5 border-t border-border pt-2 font-mono text-[10px] text-text-secondary">
          <div>Camera Status: {media.cameraStatus} {media.cameraStatusMessage ? `(${media.cameraStatusMessage})` : ""}</div>
          <div>Microphone Status: {media.microphoneStatus} {media.microphoneStatusMessage ? `(${media.microphoneStatusMessage})` : ""}</div>
          <div>Agora State: {agora.connectionState} (configured: {String(liveAccessData?.agoraConfigured)})</div>
          <div>Socket Connected: {String(socket.isConnected)}</div>
          <div>Creator ID: {liveAccessData?.creator?.id || "N/A"}</div>
        </div>
      </details>

      {/* Access Denied Modal */}
      {liveAccessData && !liveAccessData.authorized && (
        <LiveAccessDeniedModal
          isOpen={showAccessDeniedModal}
          reason={liveAccessData.reason}
          message={liveAccessData.message}
          onClose={() => router.push("/creator")}
        />
      )}

      {/* Post-Stream Summary Modal */}
      <PostStreamModal
        isOpen={showPostStreamModal}
        summary={summaryData}
        onClose={() => setShowPostStreamModal(false)}
        onReturnDashboard={() => router.push("/creator")}
      />

      {/* Permission Guide & Hardware Diagnostics Modal */}
      <PermissionGuideModal
        isOpen={showPermissionGuideModal}
        onClose={() => setShowPermissionGuideModal(false)}
        onRetry={() => media.startPreview(media.selectedCameraId, media.selectedMicrophoneId)}
        isRequesting={media.isRequesting}
        cameraStatus={media.cameraStatus}
        microphoneStatus={media.microphoneStatus}
        cameraMessage={media.cameraStatusMessage}
        microphoneMessage={media.microphoneStatusMessage}
      />
    </div>
  );
}

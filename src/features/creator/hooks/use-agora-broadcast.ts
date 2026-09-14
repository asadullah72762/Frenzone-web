"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  NetworkQuality,
  ConnectionState,
} from "agora-rtc-sdk-ng";

export type StreamProfile = "720p" | "480p" | "360p" | "audio-priority";

export interface NetworkQualityInfo {
  uplink: number; // 0-6
  downlink: number; // 0-6
  label: "Excellent" | "Good" | "Poor" | "Bad" | "Very Bad" | "Down" | "Unknown";
  rtt?: number;
  packetLoss?: number;
  sendBitrate?: number;
}

export function useAgoraBroadcast() {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>("DISCONNECTED");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<StreamProfile>("720p");
  const [networkQuality, setNetworkQuality] = useState<NetworkQualityInfo>({
    uplink: 0,
    downlink: 0,
    label: "Unknown",
  });
  const [broadcastError, setBroadcastError] = useState<string | null>(null);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const audioTrackRef = useRef<IMicrophoneAudioTrack | ILocalAudioTrack | null>(null);
  const videoTrackRef = useRef<ICameraVideoTrack | ILocalVideoTrack | null>(null);
  const videoContainerRef = useRef<HTMLElement | null>(null);

  // Map Agora quality code to label
  const getQualityLabel = (uplink: number): NetworkQualityInfo["label"] => {
    switch (uplink) {
      case 1:
        return "Excellent";
      case 2:
        return "Good";
      case 3:
        return "Poor";
      case 4:
        return "Bad";
      case 5:
        return "Very Bad";
      case 6:
        return "Down";
      default:
        return "Unknown";
    }
  };

  // Adaptive Network Profiler
  const applyAdaptiveProfile = useCallback(async (uplinkQuality: number) => {
    const videoTrack = videoTrackRef.current;
    if (!videoTrack) return;

    try {
      if (uplinkQuality >= 4) {
        // Severe network degradation: Switch to 360p or Audio-Priority
        console.warn("Network degraded (quality " + uplinkQuality + "): downscaling video profile to 360p");
        await videoTrack.setEncoderConfiguration({
          width: 640,
          height: 360,
          frameRate: 15,
          bitrateMin: 200,
          bitrateMax: 400,
        });
        setCurrentProfile("360p");
      } else if (uplinkQuality === 3) {
        // Moderate degradation: Switch to 480p
        console.log("Network moderate (quality 3): adapting video profile to 480p");
        await videoTrack.setEncoderConfiguration({
          width: 640,
          height: 480,
          frameRate: 24,
          bitrateMin: 400,
          bitrateMax: 800,
        });
        setCurrentProfile("480p");
      } else if (uplinkQuality <= 2 && uplinkQuality > 0) {
        // High quality network: Restore 720p
        await videoTrack.setEncoderConfiguration({
          width: 1280,
          height: 720,
          frameRate: 30,
          bitrateMin: 800,
          bitrateMax: 1500,
        });
        setCurrentProfile("720p");
      }
    } catch (err) {
      console.warn("Could not adapt video encoder configuration:", err);
    }
  }, []);

  // Initialize Agora RTC client and join channel
  const joinAndPublish = useCallback(
    async (params: {
      appId: string;
      channelName: string;
      token: string;
      uid: string | number;
      cameraId?: string;
      microphoneId?: string;
    }) => {
      if (typeof window === "undefined") return;

      setIsJoining(true);
      setBroadcastError(null);

      try {
        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;

        // Ensure single client instance
        if (!clientRef.current) {
          const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
          clientRef.current = client;

          // Event listeners
          client.on("connection-state-change", (curState, revState, reason) => {
            console.log("Agora connection state:", curState, "reason:", reason);
            setConnectionState(curState);
            if (curState === "DISCONNECTED") {
              if (reason === "FALLBACK") {
                setBroadcastError("Connection lost. Retrying connection...");
              }
            }
          });

          client.on("network-quality", (quality: NetworkQuality) => {
            const uplink = quality.uplinkNetworkQuality;
            const downlink = quality.downlinkNetworkQuality;
            const label = getQualityLabel(uplink);

            setNetworkQuality((prev) => ({
              ...prev,
              uplink,
              downlink,
              label,
            }));

            // Auto-adjust video bitrate and resolution
            applyAdaptiveProfile(uplink);
          });
        }

        const client = clientRef.current;

        // Check if real 32-hex Agora App ID is provided
        const cleanAppId = (params.appId || "").trim();
        const isRealHex = /^[a-fA-F0-9]{32}$/.test(cleanAppId) && !/^(.)\1+$/.test(cleanAppId);

        if (isRealHex) {
          // Join channel on official Agora RTC edge servers
          await client.join(cleanAppId, params.channelName, params.token, params.uid);

          // Track creation from real hardware devices with fallback
          try {
            const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
              params.microphoneId ? { microphoneId: params.microphoneId } : {},
              {
                ...(params.cameraId ? { cameraId: params.cameraId } : {}),
                encoderConfig: {
                  width: 1280,
                  height: 720,
                  frameRate: 30,
                  bitrateMin: 800,
                  bitrateMax: 1500,
                },
              }
            );
            audioTrackRef.current = audioTrack;
            videoTrackRef.current = videoTrack;
          } catch (bothErr) {
            console.warn("Agora createMicrophoneAndCameraTracks failed, trying individually:", bothErr);
            try {
              audioTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack(
                params.microphoneId ? { microphoneId: params.microphoneId } : {}
              );
            } catch (aErr) {
              console.warn("Could not initialize microphone track:", aErr);
            }
            try {
              videoTrackRef.current = await AgoraRTC.createCameraVideoTrack({
                ...(params.cameraId ? { cameraId: params.cameraId } : {}),
              });
            } catch (vErr) {
              console.warn("Could not initialize camera track:", vErr);
            }
          }

          const tracksToPublish = [audioTrackRef.current, videoTrackRef.current].filter(Boolean) as (ILocalAudioTrack | ILocalVideoTrack)[];
          if (tracksToPublish.length > 0) {
            await client.publish(tracksToPublish);
          }

          // Attach local preview if container is present and video track exists
          if (videoContainerRef.current && videoTrackRef.current) {
            videoTrackRef.current.play(videoContainerRef.current, { fit: "cover", mirror: true });
          }
        } else {
          console.warn("Broadcasting in development mode: Agora RTC placeholder credentials configured.");
        }

        setIsBroadcasting(true);
        setIsJoining(false);
        setIsAudioMuted(false);
        setIsVideoMuted(false);
        setCurrentProfile("720p");
      } catch (err: any) {
        console.error("Agora Broadcast Error:", err);
        setBroadcastError(err.message || "Failed to establish live broadcast with Agora.");
        setIsJoining(false);
        setIsBroadcasting(false);
        throw err;
      }
    },
    [applyAdaptiveProfile]
  );

  // Leave channel and stop publishing
  const leaveAndUnpublish = useCallback(async () => {
    try {
      if (audioTrackRef.current) {
        audioTrackRef.current.stop();
        audioTrackRef.current.close();
        audioTrackRef.current = null;
      }

      if (videoTrackRef.current) {
        videoTrackRef.current.stop();
        videoTrackRef.current.close();
        videoTrackRef.current = null;
      }

      if (clientRef.current) {
        await clientRef.current.leave();
      }
    } catch (err) {
      console.warn("Agora cleanup notice:", err);
    } finally {
      setIsBroadcasting(false);
      setIsJoining(false);
      setConnectionState("DISCONNECTED");
      setNetworkQuality({ uplink: 0, downlink: 0, label: "Unknown" });
    }
  }, []);

  // Toggle Audio Mute
  const toggleMuteAudio = useCallback(async () => {
    if (!audioTrackRef.current) return;
    const next = !isAudioMuted;
    await audioTrackRef.current.setEnabled(!next);
    setIsAudioMuted(next);
  }, [isAudioMuted]);

  // Toggle Video Mute
  const toggleMuteVideo = useCallback(async () => {
    if (!videoTrackRef.current) return;
    const next = !isVideoMuted;
    await videoTrackRef.current.setEnabled(!next);
    setIsVideoMuted(next);
  }, [isVideoMuted]);

  // Switch Camera Device
  const switchCamera = useCallback(async (deviceId: string) => {
    if (!videoTrackRef.current) return;
    try {
      if ("setDevice" in videoTrackRef.current) {
        await (videoTrackRef.current as ICameraVideoTrack).setDevice(deviceId);
      }
    } catch (err) {
      console.error("Failed to switch camera:", err);
    }
  }, []);

  // Switch Microphone Device
  const switchMicrophone = useCallback(async (deviceId: string) => {
    if (!audioTrackRef.current) return;
    try {
      if ("setDevice" in audioTrackRef.current) {
        await (audioTrackRef.current as IMicrophoneAudioTrack).setDevice(deviceId);
      }
    } catch (err) {
      console.error("Failed to switch microphone:", err);
    }
  }, []);

  // Attach video container for local rendering
  const attachVideoElement = useCallback((element: HTMLElement | null) => {
    videoContainerRef.current = element;
    if (element && videoTrackRef.current) {
      videoTrackRef.current.play(element, { fit: "cover", mirror: true });
    }
  }, []);

  // Periodic RTC Stats polling
  useEffect(() => {
    if (!isBroadcasting || !clientRef.current) return;

    const interval = setInterval(() => {
      const client = clientRef.current;
      if (!client) return;

      const rtcStats = client.getRTCStats();
      setNetworkQuality((prev) => ({
        ...prev,
        rtt: rtcStats.RTT,
        sendBitrate: Math.round((rtcStats.SendBitrate || 0) / 1000), // in kbps
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isBroadcasting]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leaveAndUnpublish();
    };
  }, [leaveAndUnpublish]);

  return {
    isBroadcasting,
    isJoining,
    connectionState,
    isAudioMuted,
    isVideoMuted,
    currentProfile,
    networkQuality,
    broadcastError,
    joinAndPublish,
    leaveAndUnpublish,
    toggleMuteAudio,
    toggleMuteVideo,
    switchCamera,
    switchMicrophone,
    attachVideoElement,
  };
}

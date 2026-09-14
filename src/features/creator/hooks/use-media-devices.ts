"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type DeviceReadinessState =
  | "ready"
  | "loading"
  | "off"
  | "muted"
  | "unavailable"
  | "in-use"
  | "blocked"
  | "error";

export type PermissionStateValue = "prompt" | "granted" | "denied" | "unsupported" | "unknown";

export interface MediaDeviceState {
  cameras: MediaDeviceInfo[];
  microphones: MediaDeviceInfo[];
  selectedCameraId: string;
  selectedMicrophoneId: string;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  audioLevel: number; // 0 to 100
  permissionStatus: "prompt" | "granted" | "denied" | "unsupported";
  cameraStatus: DeviceReadinessState;
  microphoneStatus: DeviceReadinessState;
  cameraStatusMessage: string | null;
  microphoneStatusMessage: string | null;
  canBroadcast: boolean;
  hasDeviceDisconnected: boolean;
  isRequesting: boolean;
}

export function useMediaDevices() {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [selectedMicrophoneId, setSelectedMicrophoneId] = useState<string>("");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const [permissionStatus, setPermissionStatus] = useState<"prompt" | "granted" | "denied" | "unsupported">("prompt");
  const [cameraStatus, setCameraStatus] = useState<DeviceReadinessState>("loading");
  const [microphoneStatus, setMicrophoneStatus] = useState<DeviceReadinessState>("loading");
  const [cameraStatusMessage, setCameraStatusMessage] = useState<string | null>(null);
  const [microphoneStatusMessage, setMicrophoneStatusMessage] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const [hasDeviceDisconnected, setHasDeviceDisconnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isInitializingRef = useRef(false);

  // Enumerate input devices
  const enumerateDevices = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) {
      setPermissionStatus("unsupported");
      return;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === "videoinput");
      const audioInputs = devices.filter((d) => d.kind === "audioinput");

      setCameras(videoInputs);
      setMicrophones(audioInputs);

      setSelectedCameraId((prev) => {
        if (prev && videoInputs.some((d) => d.deviceId === prev)) return prev;
        return videoInputs[0]?.deviceId || "";
      });

      setSelectedMicrophoneId((prev) => {
        if (prev && audioInputs.some((d) => d.deviceId === prev)) return prev;
        return audioInputs[0]?.deviceId || "";
      });
    } catch (err: any) {
      console.warn("Could not enumerate media devices:", err);
    }
  }, []);

  // Cleanup audio analyzer
  const cleanupAudioMeter = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
  }, []);

  // Start audio VU meter using Web Audio API
  const startAudioMeter = useCallback((stream: MediaStream) => {
    cleanupAudioMeter();

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.6;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setAudioLevel(normalized);

        animFrameRef.current = requestAnimationFrame(updateMeter);
      };

      updateMeter();
    } catch (e) {
      console.warn("Web Audio VU meter init note:", e);
    }
  }, [cleanupAudioMeter]);

  // Clean up existing local preview stream
  const stopPreview = useCallback(() => {
    cleanupAudioMeter();
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {}
      });
      localStreamRef.current = null;
    }
    setLocalStream(null);
  }, [cleanupAudioMeter]);

  // Release camera/mic tracks without resetting UI state (useful for Agora handoff)
  const releaseStream = useCallback(() => {
    cleanupAudioMeter();
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {}
      });
      localStreamRef.current = null;
    }
    setLocalStream(null);
  }, [cleanupAudioMeter]);

  // Request media stream with independent camera and microphone error handling
  const startPreview = useCallback(
    async (cameraId?: string, microphoneId?: string): Promise<MediaStream | null> => {
      // 1. Check browser and secure context support
      if (typeof window !== "undefined" && !window.isSecureContext) {
        setPermissionStatus("unsupported");
        setCameraStatus("blocked");
        setMicrophoneStatus("blocked");
        const insecureMsg = "Insecure origin: Camera and microphone require HTTPS or localhost.";
        setCameraStatusMessage(insecureMsg);
        setMicrophoneStatusMessage(insecureMsg);
        return null;
      }

      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setPermissionStatus("unsupported");
        setCameraStatus("unavailable");
        setMicrophoneStatus("unavailable");
        setCameraStatusMessage("Browser does not support camera access.");
        setMicrophoneStatusMessage("Browser does not support microphone access.");
        return null;
      }

      if (isInitializingRef.current) return localStreamRef.current;
      isInitializingRef.current = true;
      setIsRequesting(true);

      setCameraStatus("loading");
      setMicrophoneStatus("loading");
      setCameraStatusMessage(null);
      setMicrophoneStatusMessage(null);
      setHasDeviceDisconnected(false);

      stopPreview();

      // Clean baseline constraints
      const videoConstraints: MediaStreamConstraints["video"] = cameraId
        ? { deviceId: { exact: cameraId } }
        : true;

      const audioConstraints: MediaStreamConstraints["audio"] = microphoneId
        ? { deviceId: { exact: microphoneId } }
        : true;

      try {
        let stream: MediaStream;
        try {
          // Attempt unified access first
          stream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraints,
            audio: audioConstraints,
          });
        } catch (firstErr: any) {
          const name = firstErr?.name || "";
          console.warn("Primary getUserMedia prompt note:", name, firstErr?.message);

          // Fallback: request unconstrained video first, then audio independently to isolate which device failed
          const fallbackStream = new MediaStream();
          let videoSuccess = false;
          let audioSuccess = false;

          try {
            const vStream = await navigator.mediaDevices.getUserMedia({
              video: cameraId ? { deviceId: { exact: cameraId } } : true,
            });
            vStream.getVideoTracks().forEach((t) => fallbackStream.addTrack(t));
            videoSuccess = true;
          } catch (vErr: any) {
            console.warn("Video-only fallback error:", vErr?.name, vErr?.message);
            if (vErr?.name === "NotAllowedError" || vErr?.name === "PermissionDeniedError") {
              setCameraStatus("blocked");
              setCameraStatusMessage("Camera access blocked by browser settings.");
            } else if (vErr?.name === "NotReadableError") {
              setCameraStatus("in-use");
              setCameraStatusMessage("Camera is in use by another application (e.g. OBS, Zoom, Teams).");
            } else if (vErr?.name === "NotFoundError" || vErr?.name === "DevicesNotFoundError") {
              setCameraStatus("unavailable");
              setCameraStatusMessage("No camera hardware detected on this device.");
            } else {
              setCameraStatus("error");
              setCameraStatusMessage(vErr?.message || "Failed to start camera.");
            }
          }

          try {
            const aStream = await navigator.mediaDevices.getUserMedia({
              audio: microphoneId ? { deviceId: { exact: microphoneId } } : true,
            });
            aStream.getAudioTracks().forEach((t) => fallbackStream.addTrack(t));
            audioSuccess = true;
          } catch (aErr: any) {
            console.warn("Audio-only fallback error:", aErr?.name, aErr?.message);
            if (aErr?.name === "NotAllowedError" || aErr?.name === "PermissionDeniedError") {
              setMicrophoneStatus("blocked");
              setMicrophoneStatusMessage("Microphone access blocked by browser settings.");
            } else if (aErr?.name === "NotFoundError" || aErr?.name === "DevicesNotFoundError") {
              setMicrophoneStatus("unavailable");
              setMicrophoneStatusMessage("No microphone detected.");
            } else {
              setMicrophoneStatus("error");
              setMicrophoneStatusMessage(aErr?.message || "Failed to start microphone.");
            }
          }

          if (!videoSuccess && !audioSuccess) {
            setPermissionStatus("denied");
            return null;
          }

          stream = fallbackStream;
        }

        const videoTrack = stream.getVideoTracks()[0];
        const audioTrack = stream.getAudioTracks()[0];

        if (videoTrack) {
          videoTrack.enabled = !isVideoMuted;
          setCameraStatus(isVideoMuted ? "off" : "ready");
          setCameraStatusMessage(null);
        } else if (cameraStatus === "loading") {
          setCameraStatus("unavailable");
          setCameraStatusMessage("No video track available.");
        }

        if (audioTrack) {
          audioTrack.enabled = !isAudioMuted;
          setMicrophoneStatus(isAudioMuted ? "muted" : "ready");
          setMicrophoneStatusMessage(null);
          startAudioMeter(stream);
        } else if (microphoneStatus === "loading") {
          setMicrophoneStatus("unavailable");
          setMicrophoneStatusMessage("No audio track available.");
        }

        if (videoTrack || audioTrack) {
          localStreamRef.current = stream;
          setLocalStream(stream);
          setPermissionStatus("granted");
          await enumerateDevices();
          return stream;
        }

        return null;
      } catch (err: any) {
        console.warn("Unhandled startPreview error:", err);
        return null;
      } finally {
        isInitializingRef.current = false;
        setIsRequesting(false);
      }
    },
    [isAudioMuted, isVideoMuted, stopPreview, startAudioMeter, enumerateDevices, cameraStatus, microphoneStatus]
  );

  // Actively request permission and prompt browser immediately
  const requestPermission = useCallback(async () => {
    isInitializingRef.current = false;
    stopPreview();
    return await startPreview();
  }, [startPreview, stopPreview]);

  // Monitor browser permission status via navigator.permissions.query
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.permissions?.query) return;

    let cameraPerm: PermissionStatus | null = null;
    let micPerm: PermissionStatus | null = null;

    const checkAndListen = async () => {
      try {
        cameraPerm = await navigator.permissions.query({ name: "camera" as any });
        if (cameraPerm) {
          if (cameraPerm.state === "denied") {
            setPermissionStatus("denied");
            setCameraStatus("blocked");
            setCameraStatusMessage("Camera permission is blocked in your browser site settings.");
          } else if (cameraPerm.state === "granted" && !localStreamRef.current) {
            setPermissionStatus("granted");
          }

          cameraPerm.onchange = () => {
            console.log("Browser camera permission state changed to:", cameraPerm?.state);
            if (cameraPerm?.state === "granted") {
              setPermissionStatus("granted");
              setCameraStatus("ready");
              setCameraStatusMessage(null);
              startPreview();
            } else if (cameraPerm?.state === "denied") {
              setPermissionStatus("denied");
              setCameraStatus("blocked");
              setCameraStatusMessage("Camera permission is blocked in your browser site settings.");
            }
          };
        }
      } catch (e) {
        // Some browsers do not support { name: 'camera' }
      }

      try {
        micPerm = await navigator.permissions.query({ name: "microphone" as any });
        if (micPerm) {
          if (micPerm.state === "denied") {
            setMicrophoneStatus("blocked");
            setMicrophoneStatusMessage("Microphone permission is blocked in your browser site settings.");
          }

          micPerm.onchange = () => {
            console.log("Browser microphone permission state changed to:", micPerm?.state);
            if (micPerm?.state === "granted") {
              setMicrophoneStatus("ready");
              setMicrophoneStatusMessage(null);
              startPreview();
            } else if (micPerm?.state === "denied") {
              setMicrophoneStatus("blocked");
              setMicrophoneStatusMessage("Microphone permission is blocked in your browser site settings.");
            }
          };
        }
      } catch (e) {
        // Some browsers do not support { name: 'microphone' }
      }
    };

    checkAndListen();

    return () => {
      if (cameraPerm) cameraPerm.onchange = null;
      if (micPerm) micPerm.onchange = null;
    };
  }, [startPreview]);

  // Toggle Mute Audio
  const toggleMuteAudio = useCallback(() => {
    setIsAudioMuted((prev) => {
      const next = !prev;
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((t) => {
          t.enabled = !next;
        });
      }
      setMicrophoneStatus(next ? "muted" : "ready");
      return next;
    });
  }, []);

  // Toggle Mute Video
  const toggleMuteVideo = useCallback(() => {
    setIsVideoMuted((prev) => {
      const next = !prev;
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach((t) => {
          t.enabled = !next;
        });
      }
      setCameraStatus(next ? "off" : "ready");
      return next;
    });
  }, []);

  // Switch Camera Device
  const switchCamera = useCallback(
    async (deviceId: string) => {
      setSelectedCameraId(deviceId);
      await startPreview(deviceId, selectedMicrophoneId);
    },
    [selectedMicrophoneId, startPreview]
  );

  // Switch Microphone Device
  const switchMicrophone = useCallback(
    async (deviceId: string) => {
      setSelectedMicrophoneId(deviceId);
      await startPreview(selectedCameraId, deviceId);
    },
    [selectedCameraId, startPreview]
  );

  // Listen for hardware changes (USB unplug / plug)
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.addEventListener) return;

    const handleDeviceChange = async () => {
      await enumerateDevices();
      if (localStreamRef.current) {
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        const audioTrack = localStreamRef.current.getAudioTracks()[0];
        if (videoTrack?.readyState === "ended" || audioTrack?.readyState === "ended") {
          setHasDeviceDisconnected(true);
        }
      }
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
    };
  }, [enumerateDevices]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPreview();
    };
  }, [stopPreview]);

  // Allow broadcasting if at least video is ready (or mic is ready)
  const canBroadcast = cameraStatus === "ready" || microphoneStatus === "ready";

  return {
    cameras,
    microphones,
    selectedCameraId,
    selectedMicrophoneId,
    isAudioMuted,
    isVideoMuted,
    audioLevel,
    permissionStatus,
    cameraStatus,
    microphoneStatus,
    cameraStatusMessage,
    microphoneStatusMessage,
    canBroadcast,
    hasDeviceDisconnected,
    isRequesting,
    localStream,
    startPreview,
    requestPermission,
    stopPreview,
    releaseStream,
    toggleMuteAudio,
    toggleMuteVideo,
    switchCamera,
    switchMicrophone,
    enumerateDevices,
  };
}

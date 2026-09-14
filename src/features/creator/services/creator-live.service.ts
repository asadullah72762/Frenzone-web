import { apiClient } from "@/lib/api/client";

export interface CreatorLiveStatusResponse {
  success: boolean;
  authorized: boolean;
  reason?:
    | "banned"
    | "live_access_revoked"
    | "creator_suspended"
    | "application_rejected"
    | "application_pending"
    | "not_eligible"
    | "session_conflict"
    | string;
  message?: string;
  creator?: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    isVerified: boolean;
    liveAccess: boolean;
    isApprovedCreator: boolean;
  };
  hasActiveStream: boolean;
  activeStream?: {
    streamId: string;
    channelName: string;
    startedAt?: string;
    lastHeartbeatAt?: string;
    viewerCount?: number;
  } | null;
  agoraConfigured?: boolean;
  agoraAppId?: string;
}

export type LiveStatusResponse = CreatorLiveStatusResponse;

export interface LiveSessionStartResponse {
  success: boolean;
  resumed?: boolean;
  session: {
    streamId: string;
    channelName: string;
    token: string;
    uid: number;
    appId: string;
    startedAt: string;
  };
}

export type LiveSessionResponse = LiveSessionStartResponse;

export interface LiveHeartbeatResponse {
  success: boolean;
  streamId: string;
  lastHeartbeatAt: string;
}

export interface LiveEndSummary {
  streamId: string;
  durationSeconds: number;
  likes: number;
  giftCoins: number;
  diamondsEarned: number;
  giftsReceived: number;
  topGifters: Array<{
    userid: string;
    username: string;
    profilePicture: string;
    giftCount: number;
    coins: number;
  }>;
  endedAt: string;
}

export interface LiveEndResponse {
  success: boolean;
  alreadyEnded?: boolean;
  summary: LiveEndSummary;
}

export interface LiveSessionTelemetry {
  streamId: string;
  channelName: string;
  viewerCount: number;
  likes: number;
  giftCoins: number;
  diamondsEarned: number;
  lastHeartbeatAt?: string;
  durationSeconds: number;
}

export class CreatorLiveService {
  /**
   * Server-authoritative Live Access check.
   * Verifies account eligibility, ban status, application approval, and active session conflicts.
   */
  async checkLiveStatus(): Promise<CreatorLiveStatusResponse> {
    try {
      const res = await apiClient.get<CreatorLiveStatusResponse>("/creator/live/status");
      return res;
    } catch (err: any) {
      if (err?.response?.data) {
        return err.response.data as CreatorLiveStatusResponse;
      }
      if (err?.data) {
        return err.data as CreatorLiveStatusResponse;
      }
      return {
        success: false,
        authorized: false,
        reason: "not_eligible",
        message: err?.message || "Failed to verify live streaming authorization",
        hasActiveStream: false,
      };
    }
  }

  /**
   * Initialize a new live broadcast session on backend and acquire temporary Agora publisher token.
   */
  async startLiveSession(params?: {
    title?: string;
    category?: string;
    agoraUid?: number;
    resume?: boolean;
  }): Promise<LiveSessionStartResponse> {
    const res = await apiClient.post<LiveSessionStartResponse>("/creator/live/start", params || {});
    if (res && res.success && res.session) {
      return res;
    }
    throw new Error((res as any)?.error || (res as any)?.message || "Failed to start live broadcast session.");
  }

  /**
   * Heartbeat ping to keep session alive and prevent zombie stream reclamation.
   */
  async sendHeartbeat(
    streamId: string,
    telemetry?: { viewerCount?: number; diamondsEarned?: number }
  ): Promise<LiveHeartbeatResponse> {
    const res = await apiClient.post<LiveHeartbeatResponse>("/creator/live/heartbeat", {
      streamId,
      ...telemetry,
    });
    return res;
  }

  /**
   * Gracefully terminate broadcast session, reconcile metrics, and save StreamAnalysis.
   */
  async endLiveSession(
    streamId: string,
    metrics?: { durationSeconds?: number; peakViewers?: number; totalDiamonds?: number }
  ): Promise<LiveEndResponse> {
    const res = await apiClient.post<LiveEndResponse>("/creator/live/end", {
      streamId,
      ...metrics,
    });
    return res;
  }

  /**
   * Get real-time stream telemetry (viewer count, likes, gifts).
   */
  async getSessionTelemetry(streamId: string): Promise<LiveSessionTelemetry> {
    const res = await apiClient.get<{ success: boolean; session: LiveSessionTelemetry }>(
      `/creator/live/session/${encodeURIComponent(streamId)}`
    );
    if (res && res.session) {
      return res.session;
    }
    throw new Error("Failed to load stream telemetry.");
  }
}

export const creatorLiveService = new CreatorLiveService();

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export interface LiveChatMessage {
  id: string;
  sender: string;
  avatarUrl?: string;
  message: string;
  timestamp: string;
  isHost?: boolean;
}

export interface LiveGiftEvent {
  id: string;
  sender: string;
  giftName: string;
  iconUrl?: string;
  diamondValue: number;
  timestamp: string;
}

export function useLiveSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [comments, setComments] = useState<LiveChatMessage[]>([]);
  const [latestGift, setLatestGift] = useState<LiveGiftEvent | null>(null);
  const [totalDiamonds, setTotalDiamonds] = useState(0);

  const socketRef = useRef<Socket | null>(null);
  const activeStreamIdRef = useRef<string | null>(null);
  const activeUserRef = useRef<{ id: string; name: string; avatarUrl?: string } | null>(null);

  const connect = useCallback(
    (streamId: string, user: { id: string; name: string; avatarUrl?: string }) => {
      if (socketRef.current?.connected) return;

      activeStreamIdRef.current = streamId;
      activeUserRef.current = user;

      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

      const socket = io(backendUrl, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Live Studio Socket connected:", socket.id);
        setIsConnected(true);

        // Join live stream room
        socket.emit("joinStream", {
          streamId,
          userId: user.id,
          username: user.name,
          role: "host",
        });
      });

      socket.on("disconnect", () => {
        console.log("Live Studio Socket disconnected");
        setIsConnected(false);
      });

      // Receive viewer messages
      socket.on("newCommentInStream", (data: any) => {
        if (!data) return;
        const msg: LiveChatMessage = {
          id: data._id || String(Date.now() + Math.random()),
          sender: data.username || data.name || "Viewer",
          avatarUrl: data.profilePicture || data.avatarUrl || "",
          message: data.comment || data.message || "",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isHost: data.userId === user.id || data.isHost,
        };

        setComments((prev) => [...prev.slice(-49), msg]);
      });

      // Receive live gifts
      socket.on("newGift", (data: any) => {
        if (!data) return;
        const giftItem: LiveGiftEvent = {
          id: String(Date.now() + Math.random()),
          sender: data.senderName || data.username || "Fan",
          giftName: data.giftTitle || data.giftName || "Heart Gift",
          iconUrl: data.giftIcon || "",
          diamondValue: Number(data.diamonds || data.diamondValue || 10),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setLatestGift(giftItem);
        setTotalDiamonds((prev) => prev + giftItem.diamondValue);
      });

      // Member / Viewer Count sync
      socket.on("memberCount", (count: number) => {
        setViewerCount(Number(count) || 0);
      });

      socket.on("userJoinedStream", (data: any) => {
        if (typeof data?.count === "number") {
          setViewerCount(data.count);
        } else {
          setViewerCount((prev) => prev + 1);
        }
      });

      socket.on("userLeftStream", (data: any) => {
        if (typeof data?.count === "number") {
          setViewerCount(Math.max(0, data.count));
        } else {
          setViewerCount((prev) => Math.max(0, prev - 1));
        }
      });
    },
    []
  );

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      if (activeStreamIdRef.current) {
        socketRef.current.emit("leaveStream", { streamId: activeStreamIdRef.current });
      }
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
    activeStreamIdRef.current = null;
  }, []);

  const sendHostComment = useCallback((text: string) => {
    if (!socketRef.current?.connected || !activeStreamIdRef.current || !text.trim()) return;

    const user = activeUserRef.current;
    const streamId = activeStreamIdRef.current;

    const payload = {
      streamId,
      userId: user?.id,
      username: user?.name || "Host",
      comment: text.trim(),
      isHost: true,
    };

    socketRef.current.emit("commentInStream", payload);

    // Optimistically add to local comments
    setComments((prev) => [
      ...prev.slice(-49),
      {
        id: String(Date.now()),
        sender: user?.name || "You (Host)",
        avatarUrl: user?.avatarUrl,
        message: text.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isHost: true,
      },
    ]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    viewerCount,
    comments,
    latestGift,
    totalDiamonds,
    connect,
    disconnect,
    sendHostComment,
  };
}

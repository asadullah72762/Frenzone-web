"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Gem, Crown, X, MessageSquare } from "lucide-react";
import type { LiveChatMessage, LiveGiftEvent } from "@/features/creator/hooks/use-live-socket";

interface LiveChatPanelProps {
  comments: LiveChatMessage[];
  latestGift: LiveGiftEvent | null;
  isBroadcasting: boolean;
  onSendHostComment: (text: string) => void;
  variant?: "overlay" | "docked";
  className?: string;
  onClose?: () => void;
}

export function LiveChatPanel({
  comments,
  latestGift,
  isBroadcasting,
  onSendHostComment,
  variant = "overlay",
  className = "",
  onClose,
}: LiveChatPanelProps) {
  const [inputText, setInputText] = useState("");
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom smoothly when a new comment or gift arrives
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [comments, latestGift]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !isBroadcasting) return;
    onSendHostComment(inputText.trim());
    setInputText("");
  };

  // Only take the last 30 comments to keep DOM ultra lightweight
  const visibleComments = comments.slice(-30);

  return (
    <div
      className={`absolute bottom-16 left-4 z-30 flex flex-col justify-end pointer-events-none max-w-[320px] sm:max-w-[380px] select-none ${className}`}
    >
      {/* 1. Recent Gift Alert Floating Pill (TikTok / Facebook Live Gift Banner) */}
      {latestGift && (
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/90 via-rose-500/90 to-amber-600/90 backdrop-blur-md px-3.5 py-1.5 text-xs text-white shadow-xl shadow-amber-500/20 border border-white/20 animate-in slide-in-from-bottom-3 duration-300 pointer-events-auto">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-amber-200 shrink-0 animate-bounce">
            <Gem className="h-3 w-3" />
          </div>
          <div className="text-[11px] leading-tight drop-shadow-sm truncate">
            <strong className="font-extrabold text-amber-100">{latestGift.sender}</strong>
            <span className="text-white/90"> sent </span>
            <strong className="font-extrabold text-white">{latestGift.giftName}</strong>
            <span className="font-mono text-[10px] text-amber-200 ml-1 font-bold">
              +{latestGift.diamondValue}💎
            </span>
          </div>
        </div>
      )}

      {/* 2. Floating Comments Stream (TikTok Live style: transparent, latest comments at bottom, fades upwards) */}
      <div
        ref={chatScrollRef}
        className="max-h-[160px] sm:max-h-[190px] overflow-y-auto space-y-2 pr-2 scrollbar-none flex flex-col justify-end"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 100%)",
        }}
      >
        {visibleComments.length === 0 ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-white/70 shadow-sm">
            <MessageSquare className="h-3 w-3 text-brand" />
            <span>Chat is live! Comments will stream here...</span>
          </div>
        ) : (
          visibleComments.map((msg) => (
            <div
              key={msg.id}
              className="flex items-start animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-auto"
            >
              <div
                className={`inline-flex items-center gap-2 rounded-2xl px-3 py-1.5 text-xs shadow-lg backdrop-blur-md max-w-full break-words ${
                  msg.isHost
                    ? "bg-brand/80 text-white border border-brand/40 shadow-brand/20"
                    : "bg-black/50 text-white border border-white/10"
                }`}
              >
                {/* Avatar / Initial */}
                {msg.avatarUrl ? (
                  <img
                    src={msg.avatarUrl}
                    alt={msg.sender}
                    className="h-4 w-4 rounded-full object-cover shrink-0 border border-white/30"
                  />
                ) : (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 font-bold text-[9px] text-white shrink-0">
                    {msg.sender.slice(0, 1).toUpperCase()}
                  </div>
                )}

                {/* Sender Name */}
                <span
                  className={`font-extrabold text-[11px] shrink-0 truncate max-w-[100px] ${
                    msg.isHost ? "text-amber-200" : "text-amber-300"
                  }`}
                >
                  {msg.sender}
                </span>

                {/* Host Badge */}
                {msg.isHost && (
                  <span className="flex items-center gap-0.5 rounded bg-amber-400/30 px-1 py-0.2 text-[8px] font-extrabold text-amber-200 uppercase shrink-0">
                    <Crown className="h-2 w-2" />
                    Host
                  </span>
                )}

                {/* Message Text */}
                <span className="text-[11px] font-medium text-white drop-shadow-sm break-all">
                  {msg.message}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 3. Host Floating Input Pill (Minimalist glass bar) */}
      <form
        onSubmit={handleSubmit}
        className="mt-2.5 flex items-center gap-1.5 pointer-events-auto max-w-[280px] sm:max-w-[320px]"
      >
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={inputText}
            disabled={!isBroadcasting}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Comment as host..."
            maxLength={140}
            className="w-full rounded-full border border-white/15 bg-black/50 backdrop-blur-md px-3.5 py-1.5 text-xs text-white placeholder:text-white/60 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all shadow-lg"
          />
          {inputText.trim() && (
            <button
              type="submit"
              disabled={!isBroadcasting}
              className="absolute right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white hover:bg-brand-hover transition-transform active:scale-95 shadow cursor-pointer"
            >
              <Send className="h-3 w-3" />
            </button>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-colors cursor-pointer shrink-0"
            title="Hide Live Chat"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>
    </div>
  );
}

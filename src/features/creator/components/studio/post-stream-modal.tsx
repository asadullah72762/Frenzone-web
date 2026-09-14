"use client";

import { CheckCircle2, Clock, Users, Gem, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface StreamSummaryData {
  streamId: string;
  title: string;
  durationFormatted: string;
  totalViewers: number;
  peakViewers: number;
  diamondsEarned: number;
  estimatedEarningsUSD: string;
}

interface PostStreamModalProps {
  isOpen: boolean;
  summary: StreamSummaryData | null;
  onClose: () => void;
  onReturnDashboard: () => void;
}

export function PostStreamModal({
  isOpen,
  summary,
  onClose,
  onReturnDashboard,
}: PostStreamModalProps) {
  if (!isOpen || !summary) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
        {/* Celebration Header */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">Broadcast Ended</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            Great stream! Your session analytics have been saved to your Frenzone Creator statements.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Duration */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-left">
            <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium">Duration</span>
            </div>
            <p className="text-base font-bold font-mono text-zinc-100">
              {summary.durationFormatted}
            </p>
          </div>

          {/* Total Viewers */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-left">
            <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
              <Users className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium">Total Viewers</span>
            </div>
            <p className="text-base font-bold text-zinc-100">
              {summary.totalViewers.toLocaleString()}
            </p>
          </div>

          {/* Diamonds Earned */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-left">
            <div className="flex items-center gap-1.5 text-amber-400 mb-1">
              <Gem className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium">Diamonds Earned</span>
            </div>
            <p className="text-base font-bold text-amber-400">
              {summary.diamondsEarned.toLocaleString()}
            </p>
          </div>

          {/* Estimated Revenue */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-left">
            <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
              <DollarSign className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium">Est. Revenue</span>
            </div>
            <p className="text-base font-bold text-emerald-400">
              ${summary.estimatedEarningsUSD}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button
            variant="primary"
            onClick={onReturnDashboard}
            icon={<ArrowRight className="h-4 w-4" />}
            className="w-full justify-center bg-brand hover:bg-brand/90 font-bold"
          >
            Return to Creator Portal
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 py-1 transition-colors"
          >
            Start Another Stream
          </button>
        </div>
      </div>
    </div>
  );
}

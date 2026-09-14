"use client";

import { Radio, Tag, Info } from "lucide-react";

interface LiveInfoPanelProps {
  title: string;
  category: string;
  isBroadcasting: boolean;
  onChangeTitle: (title: string) => void;
  onChangeCategory: (cat: string) => void;
}

const CATEGORIES = [
  "Just Chatting",
  "Music & Performance",
  "Gaming & Esports",
  "Fitness & Wellness",
  "Art & Creative",
  "Education & Tech",
  "Lifestyle & Vlogs",
];

export function LiveInfoPanel({
  title,
  category,
  isBroadcasting,
  onChangeTitle,
  onChangeCategory,
}: LiveInfoPanelProps) {
  return (
    <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <Radio className="h-4 w-4 text-brand" />
        <h4 className="text-sm font-bold text-zinc-100">Live Broadcast Details</h4>
      </div>

      <div className="space-y-3">
        {/* Stream Title */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300">
            Stream Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            disabled={isBroadcasting}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder="e.g. Chill vibes & community Q&A | Special Announcement!"
            maxLength={100}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-brand focus:ring-1 focus:ring-brand outline-none disabled:opacity-60 transition-colors"
          />
          <span className="text-[10px] text-zinc-500 float-right">
            {title.length}/100
          </span>
        </div>

        {/* Category */}
        <div className="space-y-1 pt-1">
          <label className="text-xs font-semibold text-zinc-300">
            Category
          </label>
          <select
            value={category}
            disabled={isBroadcasting}
            onChange={(e) => onChangeCategory(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-100 focus:border-brand focus:ring-1 focus:ring-brand outline-none disabled:opacity-60 transition-colors"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Tips / Live Guideline Note */}
        {!isBroadcasting && (
          <div className="flex items-start gap-2 rounded-lg bg-zinc-800/40 p-2.5 text-[11px] text-zinc-400 border border-zinc-800">
            <Info className="h-4 w-4 text-brand shrink-0 mt-0.5" />
            <span>
              Your stream will be featured on the Frenzone discovery feed and your followers will be alerted immediately.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

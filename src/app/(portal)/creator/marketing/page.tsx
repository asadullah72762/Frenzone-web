"use client";

import { useState } from "react";
import {
  Download,
  Image as ImageIcon,
  Video,
  Layers,
  Sparkles,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { EmptyState } from "@/components/feedback/empty-state";
import { creatorService } from "@/features/creator/services/creator.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import type { CreatorMarketingKit } from "@/types/creator";

const CATEGORIES = [
  "All",
  "Stream Overlay",
  "Social Badge",
  "Promo Video",
  "Banner",
  "Brand Guidelines",
] as const;

export default function CreatorMarketingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const {
    data: kits,
    isLoading,
    error,
    refetch,
  } = useAsyncData(
    () => creatorService.getMarketingKits(selectedCategory),
    [selectedCategory],
    200
  );

  const handleDownload = async (kit: CreatorMarketingKit) => {
    const assetId = kit.assetId || kit.id;
    if (!assetId || downloadingId) return;

    try {
      setDownloadingId(assetId);
      await creatorService.downloadMarketingKit(assetId, kit.fileName);
    } catch (err) {
      console.error("Failed to download asset:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Stream Overlay":
        return <Layers className="h-5 w-5" />;
      case "Social Badge":
        return <ShieldCheck className="h-5 w-5" />;
      case "Promo Video":
        return <Video className="h-5 w-5" />;
      case "Banner":
        return <ImageIcon className="h-5 w-5" />;
      case "Brand Guidelines":
        return <FileText className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Creator Marketing & Branding Kit
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Official Frenzone broadcast graphics, OBS overlays, badges, and co-branded social assets.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-text-muted bg-surface-muted/60 px-3 py-1.5 rounded-lg border border-border">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <span>Royalty-Free for Verified Creators</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-text-muted uppercase flex items-center mr-1">
          <Filter className="h-3.5 w-3.5 mr-1" /> Filter:
        </span>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 ${
                isActive
                  ? "bg-brand text-white shadow-xs font-semibold"
                  : "bg-surface-muted/70 text-text-secondary hover:bg-surface-muted hover:text-text-primary border border-border"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <ErrorState
          title="Unable to load marketing assets"
          description={error.message || "Failed to retrieve the latest brand packages. Please retry."}
          onRetry={refetch}
        />
      )}

      {/* Empty State */}
      {!isLoading && !error && (!kits || kits.length === 0) && (
        <EmptyState
          title={`No assets found in "${selectedCategory}"`}
          description="Try switching categories to view available broadcast and branding packages."
          icon={Layers}
        />
      )}

      {/* Asset Cards Grid */}
      {!isLoading && !error && kits && kits.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {kits.map((kit) => {
            const isDownloading = downloadingId === (kit.assetId || kit.id);
            return (
              <Card
                key={kit.id}
                className="group overflow-hidden flex flex-col justify-between border-border hover:border-brand/40 transition-all duration-200"
              >
                <div>
                  {/* Visual Preview Header */}
                  <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-surface-muted via-surface to-brand-soft/20 flex flex-col items-center justify-center border-b border-border p-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand shadow-sm transition-transform duration-300 group-hover:scale-110 mb-2">
                      {getCategoryIcon(kit.category)}
                    </div>
                    <span className="text-[11px] font-bold text-text-secondary tracking-wide">
                      {kit.fileFormat} • {kit.dimensions}
                    </span>
                    <span className="absolute top-3 left-3 rounded-full bg-surface/90 border border-border px-2.5 py-0.5 text-[10px] font-bold text-text-primary uppercase tracking-wider backdrop-blur-sm shadow-xs">
                      {kit.category}
                    </span>
                    {kit.downloadCount !== undefined && kit.downloadCount > 0 && (
                      <span className="absolute top-3 right-3 rounded-full bg-brand-soft/80 text-brand px-2 py-0.5 text-[10px] font-semibold">
                        {kit.downloadCount} downloads
                      </span>
                    )}
                  </div>

                  <CardHeader className="pt-4 pb-2">
                    <CardTitle className="text-base font-bold text-text-primary group-hover:text-brand transition-colors">
                      {kit.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-text-secondary line-clamp-2 mt-1 leading-relaxed">
                      {kit.description || "Official Frenzone broadcast media package."}
                    </CardDescription>
                  </CardHeader>
                </div>

                <CardContent className="pt-2">
                  <div className="text-[11px] text-text-muted mb-3 flex items-center justify-between">
                    <span>Package Size:</span>
                    <span className="font-semibold text-text-primary">{kit.fileSize}</span>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full"
                    isLoading={isDownloading}
                    disabled={isDownloading}
                    onClick={() => handleDownload(kit)}
                    icon={<Download className="h-4 w-4" />}
                  >
                    {isDownloading ? "Downloading..." : `Download Asset (${kit.fileSize})`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

